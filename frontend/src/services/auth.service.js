import { apiClient } from '@/services/api-client'

function normalizeUser(user) {
  if (!user) return null

  return {
    id: user._id ?? user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
  }
}

export const authService = {
  async login(credentials) {
    const { data } = await apiClient.post('/auth/login', credentials)
    return {
      user: normalizeUser(data.data.user),
      accessToken: data.data.accessToken,
    }
  },

  async register(payload) {
    const { data } = await apiClient.post('/auth/register', {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    })
    return normalizeUser(data.data.user)
  },

  async getCurrentUser() {
    const { data } = await apiClient.get('/auth/me')
    return normalizeUser(data.data.user)
  },

  async exchangeOAuthCode(code) {
    const { data } = await apiClient.post('/auth/oauth/exchange', { code })
    return data.data.accessToken
  },

  async updateProfile(payload) {
    const { data } = await apiClient.patch('/auth/profile', {
      name: payload.name,
      email: payload.email,
    })
    return normalizeUser(data.data.user)
  },

  async updateAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    const { data } = await apiClient.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return normalizeUser(data.data.user)
  },

  async changePassword(currentPassword, newPassword) {
    const { data } = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    })
    return data.message
  },

  async forgotPassword(email) {
    const { data } = await apiClient.post('/auth/forgot-password', { email })
    return data.data?.resetLink || null
  },

  async resetPassword(email, token, newPassword) {
    const { data } = await apiClient.post('/auth/reset-password', {
      email,
      token,
      newPassword,
    })
    return data.message
  },
}
