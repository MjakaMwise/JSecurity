import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import { PaginatedResponse } from './blog'

export interface Review {
  id: number
  name: string
  role: string
  quote: string
  rating: number
  service: string
  verified: boolean
  date: string
  created_at: string
}

export interface ReviewCreate {
  name: string
  role: string
  quote: string
  rating: number
  service: string
  verified?: boolean
}

export interface ReviewUpdate extends Partial<ReviewCreate> {}

export const reviewsAPI = {
  list: async (skip: number = 0, limit: number = 10, service?: string): Promise<PaginatedResponse<Review>> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) })
    if (service) params.append('service', service)
    return apiClient.get(`/reviews?${params}`)
  },

  get: async (id: number): Promise<Review> => {
    return apiClient.get(`/reviews/${id}`)
  },

  create: async (data: ReviewCreate): Promise<Review> => {
    return apiClient.post('/reviews', data)
  },

  update: async (id: number, data: ReviewUpdate): Promise<Review> => {
    return apiClient.put(`/reviews/${id}`, data)
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/reviews/${id}`)
  },
}

// React Query Hooks
export function useReviewsList(skip: number = 0, limit: number = 10, service?: string) {
  return useQuery({
    queryKey: ['reviews', skip, limit, service],
    queryFn: () => reviewsAPI.list(skip, limit, service),
    staleTime: 5 * 60 * 1000,
  })
}

export function useReviewDetail(id: number) {
  return useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewsAPI.get(id),
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ReviewCreate) => reviewsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}

export function useUpdateReview(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ReviewUpdate) => reviewsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['reviews', id] })
    },
  })
}

export function useDeleteReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => reviewsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}
