const TOKEN_KEY = 'access_token'
const REMEMBER_EMAIL_KEY = 'remember_email'

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeAccessToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// Backward compatibility aliases
export const getStoredToken = getAccessToken
export const setStoredToken = setAccessToken
export const clearStoredToken = removeAccessToken

export function getRememberedEmail() {
  return localStorage.getItem(REMEMBER_EMAIL_KEY) ?? ''
}

export function setRememberedEmail(email) {
  localStorage.setItem(REMEMBER_EMAIL_KEY, email)
}

export function clearRememberedEmail() {
  localStorage.removeItem(REMEMBER_EMAIL_KEY)
}
