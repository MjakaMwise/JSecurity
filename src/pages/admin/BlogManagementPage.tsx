import { useState } from 'react'
import { format } from 'date-fns'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useBlogList, useDeleteBlog, useCreateBlog, useUpdateBlog, BlogPostCreate } from '@/api/blog'
import { Modal } from '@/components/admin/Modal'
import { BlogForm } from '@/components/admin/forms/BlogForm'
import { notificationAPI } from '@/utils/notifications'

const CATEGORIES = ['Tech', 'Design', 'Business', 'Marketing', 'Development']

export function BlogManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)

  const { data, isLoading, error } = useBlogList()
  const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlog()
  const { mutate: createBlog, isPending: isCreating } = useCreateBlog()

  // For updates we need to handle this specially since useUpdateBlog takes the ID as a hook parameter
  const [updateBlogId, setUpdateBlogId] = useState<number | null>(null)
  const { mutate: updateBlogMutation, isPending: isUpdating } = useUpdateBlog(updateBlogId ?? 0)

  const filteredPosts = (data?.items || []).filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleCreate = async (data: BlogPostCreate) => {
    createBlog(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false)
        notificationAPI.success('Blog post created successfully')
      },
      onError: (error: any) => {
        notificationAPI.error('Failed to create blog post', error.message)
      },
    })
  }

  const handleEdit = (post: any) => {
    setEditingPost(post)
    setUpdateBlogId(post.id)
    setIsEditModalOpen(true)
  }

  const handleUpdateSubmit = async (formData: BlogPostCreate) => {
    if (!editingPost || !updateBlogMutation) return
    updateBlogMutation(formData, {
      onSuccess: () => {
        setIsEditModalOpen(false)
        setEditingPost(null)
        setUpdateBlogId(null)
        notificationAPI.success('Blog post updated successfully')
      },
      onError: (error: any) => {
        notificationAPI.error('Failed to update blog post', error.message)
      },
    })
  }

  const handleDelete = (id: number) => {
    deleteBlog(id, {
      onSuccess: () => {
        setDeleteId(null)
        notificationAPI.success('Blog post deleted successfully')
      },
      onError: (error: any) => {
        notificationAPI.error('Failed to delete blog post', error.message)
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Blog Management</h2>
          <p className="text-slate-600 mt-1">Manage your blog posts and content</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>
            Showing {paginatedPosts.length} of {filteredPosts.length} posts
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
              Error loading posts: {(error as any)?.message}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              No blog posts found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPosts.map(post => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">
                          <div className="max-w-xs truncate">{post.title}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{post.category}</Badge>
                        </TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>
                          {post.published ? (
                            <Badge className="bg-green-600">Published</Badge>
                          ) : (
                            <Badge variant="outline">Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {format(new Date(post.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(post)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(post.id)}
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
        title="Create New Blog Post"
        description="Add a new blog post to your website"
        size="lg"
      >
        <BlogForm
          onSubmit={handleCreate}
          isLoading={isCreating}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Edit Blog Post"
        description="Update the blog post details"
        size="lg"
      >
        {editingPost && (
          <BlogForm
            onSubmit={handleUpdateSubmit}
            isLoading={isUpdating}
            defaultValues={{
              title: editingPost.title,
              slug: editingPost.slug,
              content: editingPost.content,
              excerpt: editingPost.excerpt,
              category: editingPost.category,
              author: editingPost.author,
              read_time: editingPost.read_time,
              tags: editingPost.tags?.join(', ') || '',
              published: editingPost.published,
            }}
            isEditMode
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
