import apiClient from './client'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  mfa_required?: boolean
  token_type: string
}

export interface MFASetupResponse {
  secret: string
  qr_code: string
}

export interface MFAVerifyRequest {
  token: string
}

export interface TokenRefreshRequest {
  refresh_token: string
}

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post('/auth/login', credentials)
  },

  setupMFA: async (): Promise<MFASetupResponse> => {
    return apiClient.post('/auth/mfa/setup', {})
  },

  verifyMFA: async (payload: MFAVerifyRequest): Promise<LoginResponse> => {
    return apiClient.post('/auth/mfa/verify', payload)
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    return apiClient.post('/auth/refresh', { refresh_token: refreshToken })
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout', {})
    } catch (error) {
      console.error('Logout error:', error)
    }
  },
}
