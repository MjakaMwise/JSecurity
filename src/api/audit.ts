import { useQuery } from '@tanstack/react-query'
import apiClient from './client'
import { PaginatedResponse } from './blog'

export interface AuditLog {
  id: number
  user_id: number
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  entity_type: string
  entity_id: number
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  timestamp: string
  ip_address?: string
}

export const auditAPI = {
  list: async (skip: number = 0, limit: number = 10): Promise<PaginatedResponse<AuditLog>> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) })
    return apiClient.get(`/audit?${params}`)
  },
}

// React Query Hooks
export function useAuditLogs(skip: number = 0, limit: number = 10) {
  return useQuery({
    queryKey: ['audit', skip, limit],
    queryFn: () => auditAPI.list(skip, limit),
    staleTime: 60 * 1000, // 1 minute for audit logs
  })
}
