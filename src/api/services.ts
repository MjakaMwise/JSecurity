import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import { PaginatedResponse } from './blog'

export interface Service {
  id: number
  name: string
  description: string
  category: string
  features: string[]
  is_active: boolean
  created_at: string
}

export interface ServiceCreate {
  name: string
  description: string
  category: string
  features: string[]
  is_active?: boolean
}

export interface ServiceUpdate extends Partial<ServiceCreate> {}

export const servicesAPI = {
  list: async (skip: number = 0, limit: number = 10, category?: string): Promise<PaginatedResponse<Service>> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) })
    if (category) params.append('category', category)
    return apiClient.get(`/services?${params}`)
  },

  get: async (id: number): Promise<Service> => {
    return apiClient.get(`/services/${id}`)
  },

  create: async (data: ServiceCreate): Promise<Service> => {
    return apiClient.post('/services', data)
  },

  update: async (id: number, data: ServiceUpdate): Promise<Service> => {
    return apiClient.put(`/services/${id}`, data)
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/services/${id}`)
  },
}

// React Query Hooks
export function useServicesList(skip: number = 0, limit: number = 10, category?: string) {
  return useQuery({
    queryKey: ['services', skip, limit, category],
    queryFn: () => servicesAPI.list(skip, limit, category),
    staleTime: 5 * 60 * 1000,
  })
}

export function useServiceDetail(id: number) {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => servicesAPI.get(id),
  })
}

export function useCreateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ServiceCreate) => servicesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}

export function useUpdateService(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ServiceUpdate) => servicesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['services', id] })
    },
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => servicesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}
