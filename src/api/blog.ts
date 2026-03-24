import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'

export interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  author: string
  read_time: string
  tags: string[]
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  created_by_id?: number
}

export interface BlogPostCreate {
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  author: string
  read_time: string
  tags: string[]
  published?: boolean
}

export interface BlogPostUpdate extends Partial<BlogPostCreate> {}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

export const blogAPI = {
  list: async (skip: number = 0, limit: number = 10, category?: string): Promise<PaginatedResponse<BlogPost>> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) })
    if (category) params.append('category', category)
    return apiClient.get(`/blog?${params}`)
  },

  get: async (id: number): Promise<BlogPost> => {
    return apiClient.get(`/blog/${id}`)
  },

  create: async (data: BlogPostCreate): Promise<BlogPost> => {
    return apiClient.post('/blog', data)
  },

  update: async (id: number, data: BlogPostUpdate): Promise<BlogPost> => {
    return apiClient.put(`/blog/${id}`, data)
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/blog/${id}`)
  },
}

// React Query Hooks
export function useBlogList(skip: number = 0, limit: number = 10, category?: string) {
  return useQuery({
    queryKey: ['blog', skip, limit, category],
    queryFn: () => blogAPI.list(skip, limit, category),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useBlogDetail(id: number) {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogAPI.get(id),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateBlog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: BlogPostCreate) => blogAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] })
    },
  })
}

export function useUpdateBlog(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: BlogPostUpdate) => blogAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] })
      queryClient.invalidateQueries({ queryKey: ['blog', id] })
    },
  })
}

export function useDeleteBlog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => blogAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] })
    },
  })
}
