import { mockRequest } from './mockData'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

class APIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getHeaders() {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    const token = localStorage.getItem('accessToken')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    if (USE_MOCK) {
      const method = (options.method || 'GET').toUpperCase()
      const body = options.body ? JSON.parse(options.body as string) : undefined
      return Promise.resolve(mockRequest(method, endpoint, body))
    }

    const url = `${this.baseURL}${endpoint}`
    const headers = this.getHeaders()

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...(options.headers || {}),
        },
      })

      // Handle unauthorized
      if (response.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          try {
            const refreshResponse = await fetch(`${this.baseURL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh_token: refreshToken }),
            })

            if (refreshResponse.ok) {
              const data = await refreshResponse.json()
              localStorage.setItem('accessToken', data.access_token)
              // Retry original request with new token
              return this.request(endpoint, options)
            }
          } catch (error) {
            console.error('Token refresh failed:', error)
          }
        }
        // Clear auth and redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }

      const data = await response.json()

      if (!response.ok) {
        const error = new Error(data.detail || 'API Error')
        ;(error as any).response = { status: response.status, data }
        throw error
      }

      return data
    } catch (error: any) {
      console.error('API Request Error:', error)
      throw error
    }
  }

  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' })
  }

  post(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  put(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new APIClient(API_BASE_URL)
export default apiClient
