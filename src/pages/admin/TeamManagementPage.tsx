import { useState } from 'react'
import { format } from 'date-fns'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useTeamList, useDeleteTeam, useCreateTeam, useUpdateTeam } from '@/api/team'
import { Modal } from '@/components/admin/Modal'
import { TeamForm } from '@/components/admin/forms/TeamForm'
import { notificationAPI } from '@/utils/notifications'

export function TeamManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)
  const [updateTeamId, setUpdateTeamId] = useState<number | null>(null)

  const { data, isLoading, error } = useTeamList()
  const { mutate: deleteTeam, isPending: isDeleting } = useDeleteTeam()
  const { mutate: createTeam, isPending: isCreating } = useCreateTeam()
  const { mutate: updateTeamFn, isPending: isUpdating } = useUpdateTeam(updateTeamId ?? 0)

  const filteredMembers = (data?.items || []).filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleCreate = async (data: any) => {
    createTeam(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false)
        notificationAPI.success('Team member added successfully')
      },
      onError: (error: any) => {
        notificationAPI.error('Failed to add team member', error.message)
      },
    })
  }

  const handleEdit = (member: any) => {
    setEditingMember(member)
    setUpdateTeamId(member.id)
    setIsEditModalOpen(true)
  }

  const handleUpdateSubmit = async (formData: any) => {
    if (!editingMember || !updateTeamFn) return
    updateTeamFn(formData, {
      onSuccess: () => {
        setIsEditModalOpen(false)
        setEditingMember(null)
        setUpdateTeamId(null)
        notificationAPI.success('Team member updated successfully')
      },
      onError: (error: any) => {
        notificationAPI.error('Failed to update team member', error.message)
      },
    })
  }

  const handleDelete = (id: number) => {
    deleteTeam(id, {
      onSuccess: () => {
        setDeleteId(null)
        notificationAPI.success('Team member removed successfully')
      },
      onError: (error: any) => {
        notificationAPI.error('Failed to delete team member', error.message)
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Team Management</h2>
          <p className="text-slate-600 mt-1">Manage your team members</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Showing {paginatedMembers.length} of {filteredMembers.length} members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(5).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Error loading team: {(error as any)?.message}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              No team members found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMembers.map(member => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{member.position}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{member.email}</TableCell>
                        <TableCell className="text-sm">{member.phone}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(member)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(member.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
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

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Add Team Member"
        description="Add a new team member to your organization"
        size="lg"
      >
        <TeamForm
          onSubmit={handleCreate}
          isLoading={isCreating}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Edit Team Member"
        description="Update team member details"
        size="lg"
      >
        {editingMember && (
          <TeamForm
            onSubmit={handleUpdateSubmit}
            isLoading={isUpdating}
            defaultValues={{
              name: editingMember.name,
              position: editingMember.position,
              bio: editingMember.bio,
              email: editingMember.email,
              phone: editingMember.phone,
            }}
            isEditMode
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this team member? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
