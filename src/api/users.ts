import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import { PaginatedResponse } from './blog'

export type UserRole = 'super_admin' | 'admin' | 'editor'

export interface User {
  id: number
  username: string
  email: string
  role: UserRole
  mfa_enabled: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserCreate {
  username: string
  email: string
  password: string
  role: UserRole
}

export interface UserUpdate {
  username?: string
  email?: string
  role?: UserRole
}

export const usersAPI = {
  list: async (skip: number = 0, limit: number = 10, role?: string, isActive?: boolean): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) })
    if (role) params.append('role', role)
    if (isActive !== undefined) params.append('is_active', String(isActive))
    return apiClient.get(`/users?${params}`)
  },

  get: async (id: number): Promise<User> => {
    return apiClient.get(`/users/${id}`)
  },

  create: async (data: UserCreate): Promise<User> => {
    return apiClient.post('/users', data)
  },

  update: async (id: number, data: UserUpdate): Promise<User> => {
    return apiClient.put(`/users/${id}`, data)
  },

  updateRole: async (id: number, newRole: UserRole): Promise<User> => {
    return apiClient.put(`/users/${id}/role`, { new_role: newRole })
  },

  deactivate: async (id: number): Promise<User> => {
    return apiClient.put(`/users/${id}/deactivate`, {})
  },

  activate: async (id: number): Promise<User> => {
    return apiClient.put(`/users/${id}/activate`, {})
  },
}

// React Query Hooks
export function useUsersList(skip: number = 0, limit: number = 10, role?: string, isActive?: boolean) {
  return useQuery({
    queryKey: ['users', skip, limit, role, isActive],
    queryFn: () => usersAPI.list(skip, limit, role, isActive),
    staleTime: 5 * 60 * 1000,
  })
}

export function useUserDetail(id: number) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersAPI.get(id),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UserCreate) => usersAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUser(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UserUpdate) => usersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', id] })
    },
  })
}

export function useUpdateUserRole(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newRole: UserRole) => usersAPI.updateRole(id, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', id] })
    },
  })
}

export function useDeactivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usersAPI.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useActivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usersAPI.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
