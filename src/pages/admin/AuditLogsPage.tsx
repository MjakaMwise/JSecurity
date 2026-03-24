import { useState } from 'react'
import { format } from 'date-fns'
import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuditLogs } from '@/api/audit'

const ACTION_TYPES = ['CREATE', 'UPDATE', 'DELETE']
const ENTITY_TYPES = ['BlogPost', 'Review', 'TeamMember', 'Service', 'User']

export function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAction, setSelectedAction] = useState<string>('all')
  const [selectedEntity, setSelectedEntity] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, error } = useAuditLogs()

  const filteredLogs = (data?.items || []).filter(log => {
    const matchesSearch =
      log.user_id.toString().includes(searchTerm) ||
      log.entity_id.toString().includes(searchTerm)
    const matchesAction = selectedAction === 'all' || log.action === selectedAction
    const matchesEntity = selectedEntity === 'all' || log.entity_type === selectedEntity
    return matchesSearch && matchesAction && matchesEntity
  })

  const itemsPerPage = 20
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-600'
      case 'UPDATE':
        return 'bg-blue-600'
      case 'DELETE':
        return 'bg-red-600'
      default:
        return 'bg-slate-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Audit Logs</h2>
        <p className="text-slate-600 mt-1">Track all system activities and changes</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by user ID or entity..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>
        <Select
          value={selectedAction}
          onValueChange={(value) => {
            setSelectedAction(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {ACTION_TYPES.map(action => (
              <SelectItem key={action} value={action}>
                {action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedEntity}
          onValueChange={(value) => {
            setSelectedEntity(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entity Types</SelectItem>
            {ENTITY_TYPES.map(entity => (
              <SelectItem key={entity} value={entity}>
                {entity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Showing {paginatedLogs.length} of {filteredLogs.length} entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(10).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Error loading audit logs: {(error as any)?.message}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              No audit logs found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity Type</TableHead>
                      <TableHead>Entity ID</TableHead>
                      <TableHead>Changes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLogs.map((log, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-sm">
                          {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{log.user_id}</TableCell>
                        <TableCell>
                          <Badge className={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{log.entity_type}</TableCell>
                        <TableCell className="font-mono text-sm">{log.entity_id}</TableCell>
                        <TableCell className="text-sm max-w-xs truncate">
                          {log.new_values ? JSON.stringify(log.new_values).substring(0, 50) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
