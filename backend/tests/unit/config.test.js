describe('Configuration Loading Unit Tests', () => {
  let originalEnv = {};

  beforeEach(() => {
    jest.resetModules();
    // Capture original env vars
    originalEnv = {
      RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
      RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
      API_RATE_LIMIT_MAX: process.env.API_RATE_LIMIT_MAX,
      MAX_UPLOAD_SIZE: process.env.MAX_UPLOAD_SIZE,
    };
  });

  afterEach(() => {
    // Restore original env vars
    for (const key in originalEnv) {
      if (originalEnv[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = originalEnv[key];
      }
    }
  });

  it('should load rate limiting and upload configuration from environment variables correctly', () => {
    process.env.RATE_LIMIT_WINDOW_MS = '300000'; // 5 mins
    process.env.RATE_LIMIT_MAX_REQUESTS = '50';
    process.env.API_RATE_LIMIT_MAX = '150';
    process.env.MAX_UPLOAD_SIZE = '20971520'; // 20 MB

    const securityConfig = require('../../src/config/security.config');

    expect(securityConfig.rateLimit.windowMs).toBe(300000);
    expect(securityConfig.rateLimit.max).toBe(50);
    expect(securityConfig.apiRateLimit.windowMs).toBe(300000);
    expect(securityConfig.apiRateLimit.max).toBe(150);
    expect(securityConfig.uploads.maxSize).toBe(20971520);
  });

  it('should fall back to defaults when environment variables are not set', () => {
    delete process.env.RATE_LIMIT_WINDOW_MS;
    delete process.env.RATE_LIMIT_MAX_REQUESTS;
    delete process.env.API_RATE_LIMIT_MAX;
    delete process.env.MAX_UPLOAD_SIZE;

    const securityConfig = require('../../src/config/security.config');

    expect(securityConfig.rateLimit.windowMs).toBe(15 * 60 * 1000); // 15 mins
    expect(securityConfig.rateLimit.max).toBe(5);
    expect(securityConfig.apiRateLimit.max).toBe(30);
    expect(securityConfig.uploads.maxSize).toBe(5 * 1024 * 1024); // 5 MB
  });
});
