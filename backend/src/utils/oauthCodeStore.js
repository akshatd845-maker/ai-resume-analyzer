const crypto = require('crypto');

const TTL_MS = 5 * 60 * 1000; // 5 minutes
const store = new Map();

const createOAuthCode = (accessToken) => {
  const code = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + TTL_MS;

  store.set(code, { accessToken, expiresAt });

  return code;
};

const exchangeOAuthCode = (code) => {
  const entry = store.get(code);

  if (!entry) {
    return null;
  }

  store.delete(code);

  if (Date.now() > entry.expiresAt) {
    return null;
  }

  return entry.accessToken;
};

// Periodic cleanup of expired codes
setInterval(() => {
  const now = Date.now();
  for (const [code, entry] of store.entries()) {
    if (now > entry.expiresAt) {
      store.delete(code);
    }
  }
}, 60 * 1000).unref();

module.exports = {
  createOAuthCode,
  exchangeOAuthCode,
};
