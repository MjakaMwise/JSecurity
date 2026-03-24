import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, Shield } from 'lucide-react'
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
import { useUsersList, useCreateUser, useUpdateUser, useDeactivateUser } from '@/api/users'
import { Modal } from '@/components/admin/Modal'
import { UserForm } from '@/components/admin/forms/UserForm'
import { notificationAPI } from '@/utils/notifications'

export function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deactivateId, setDeactivateId] = useState<number | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [updateUserId, setUpdateUserId] = useState<number | null>(null)

  const { data, isLoading, error } = useUsersList()
  const { mutate: createUser, isPending: isCreating } = useCreateUser()
  const { mutate: updateUserFn, isPending: isUpdating } = useUpdateUser(updateUserId ?? 0)
  const { mutate: deactivateUser, isPending: isDeactivating } = useDeactivateUser()

  const filteredUsers = (data?.items || []).filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleCreate = async (data: any) => {
    createUser(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false)
        notificationAPI.success('User created successfully')
      },
      onError: (error: any) => {
        notificationAPI.error('Failed to create user', error.message)
      },
    })
  }

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setUpdateUserId(user.id)
    setIsEditModalOpen(true)
  }

  const handleUpdateSubmit = async (formData: any) => {
    if (!editingUser || !updateUserFn) return
    const { password, ...updateData } = formData
    updateUserFn({ ...updateData, ...(password && { password }) }, {
      onSuccess: () => {
        setIsEditModalOpen(false)
        setEditingUser(null)
        setUpdateUserId(null)
        notificationAPI.success('User updated successfully')
      },
      onError: (error: any) => {
        notificationAPI.error('Failed to update user', error.message)
      },
    })
  }

  const handleDeactivate = (id: number) => {
    deactivateUser(id, {
      onSuccess: () => {
        setDeactivateId(null)
        notificationAPI.success('User deactivated successfully')
      },
      onError: (error: any) => {
        notificationAPI.error('Failed to deactivate user', error.message)
      },
    })
  }

  const getRoleBadge = (role: string) => {
    const roleColors = {
      editor: 'bg-blue-600',
      admin: 'bg-purple-600',
      super_admin: 'bg-red-600',
    }
    return roleColors[role as keyof typeof roleColors] || 'bg-slate-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-600 mt-1">Manage users and their roles (Super Admin only)</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New User
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search users..."
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
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Showing {paginatedUsers.length} of {filteredUsers.length} users
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
              Error loading users: {(error as any)?.message}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              No users found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>MFA</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell className="text-sm">{user.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadge(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.mfa_enabled ? (
                            <Badge className="bg-green-600">Enabled</Badge>
                          ) : (
                            <Badge variant="outline">Disabled</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.is_active ? (
                            <Badge className="bg-green-600">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {user.is_active && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(user)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeactivateId(user.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
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
        title="Create New User"
        description="Add a new user to the system"
        size="md"
      >
        <UserForm
          onSubmit={handleCreate}
          isLoading={isCreating}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Edit User"
        description="Update user details and role"
        size="md"
      >
        {editingUser && (
          <UserForm
            onSubmit={handleUpdateSubmit}
            isLoading={isUpdating}
            defaultValues={{
              username: editingUser.username,
              email: editingUser.email,
              role: editingUser.role,
            }}
            isEditMode
          />
        )}
      </Modal>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={deactivateId !== null} onOpenChange={(open) => !open && setDeactivateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate this user? They will no longer be able to access the system. This action can be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deactivateId && handleDeactivate(deactivateId)}
              disabled={isDeactivating}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeactivating ? 'Deactivating...' : 'Deactivate'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
