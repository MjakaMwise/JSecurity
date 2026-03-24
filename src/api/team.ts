import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import { PaginatedResponse } from './blog'

export interface TeamMember {
  id: number
  name: string
  position: string
  department: string
  email: string
  phone: string
  created_at: string
}

export interface TeamMemberCreate {
  name: string
  position: string
  department: string
  email: string
  phone: string
}

export interface TeamMemberUpdate extends Partial<TeamMemberCreate> {}

export const teamAPI = {
  list: async (skip: number = 0, limit: number = 10, department?: string): Promise<PaginatedResponse<TeamMember>> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) })
    if (department) params.append('department', department)
    return apiClient.get(`/team?${params}`)
  },

  get: async (id: number): Promise<TeamMember> => {
    return apiClient.get(`/team/${id}`)
  },

  create: async (data: TeamMemberCreate): Promise<TeamMember> => {
    return apiClient.post('/team', data)
  },

  update: async (id: number, data: TeamMemberUpdate): Promise<TeamMember> => {
    return apiClient.put(`/team/${id}`, data)
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/team/${id}`)
  },
}

// React Query Hooks
export function useTeamList(skip: number = 0, limit: number = 10, department?: string) {
  return useQuery({
    queryKey: ['team', skip, limit, department],
    queryFn: () => teamAPI.list(skip, limit, department),
    staleTime: 5 * 60 * 1000,
  })
}

export function useTeamDetail(id: number) {
  return useQuery({
    queryKey: ['team', id],
    queryFn: () => teamAPI.get(id),
  })
}

export function useCreateTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TeamMemberCreate) => teamAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    },
  })
}

export function useUpdateTeam(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TeamMemberUpdate) => teamAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
      queryClient.invalidateQueries({ queryKey: ['team', id] })
    },
  })
}

export function useDeleteTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => teamAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    },
  })
}
