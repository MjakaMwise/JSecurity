import { useState } from 'react'
import { format } from 'date-fns'
import { Plus, Edit2, Trash2, Search, Star } from 'lucide-react'
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
import { useReviewsList, useDeleteReview, useCreateReview, useUpdateReview } from '@/api/reviews'
import { Modal } from '@/components/admin/Modal'
import { ReviewForm } from '@/components/admin/forms/ReviewForm'


import { notificationAPI } from '@/utils/notifications'

const RATINGS = [5, 4, 3, 2, 1]
  
export function ReviewsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRating, setSelectedRating] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<any>(null)
  const [updateReviewId, setUpdateReviewId] = useState<number | null>(null)

  const { data, isLoading, error } = useReviewsList()
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview()
  const { mutate: createReview, isPending: isCreating } = useCreateReview()
  const { mutate: updateReviewFn, isPending: isUpdating } = useUpdateReview(updateReviewId ?? 0)

  const filteredReviews = (data?.items || []).filter(review => {
    const matchesSearch = review.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = selectedRating === 'all' || review.rating.toString() === selectedRating
    return matchesSearch && matchesRating
  })

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleCreate = async (data: any) => {
    createReview(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false)
        notificationAPI.success('Review created successfully')
      },
      onError: (error: any) => {
        notificationAPI.error('Failed to create review', error.message)
      },
    })
  }

  const handleEdit = (review: any) => {
    setEditingReview(review)
    setUpdateReviewId(review.id)
    setIsEditModalOpen(true)
  }

  const handleUpdateSubmit = async (formData: any) => {
    if (!editingReview || !updateReviewFn) return
    updateReviewFn(formData, {
      onSuccess: () => {
        setIsEditModalOpen(false)
        setEditingReview(null)
        setUpdateReviewId(null)
        notificationAPI.success('Review updated successfully')
      },
      onError: (error: any) => {
        notificationAPI.error('Failed to update review', error.message)
      },
    })
  }

  const handleDelete = (id: number) => {
    deleteReview(id, {
      onSuccess: () => {
        setDeleteId(null)
        notificationAPI.success('Review deleted successfully')
      },
      onError: (error: any) => {
        notificationAPI.error('Failed to delete review', error.message)
      },
    })
  }

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {Array(5).fill(null).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
          }`}
        />
      ))}
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Reviews Management</h2>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage customer reviews and testimonials</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Review
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10 w-full"
          />
        </div>
        <Select
          value={selectedRating}
          onValueChange={(value) => {
            setSelectedRating(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            {RATINGS.map(rating => (
              <SelectItem key={rating} value={rating.toString()}>
                {rating}⭐ & up
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Customer Reviews</CardTitle>
          <CardDescription>
            Showing {paginatedReviews.length} of {filteredReviews.length} reviews
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
              Error loading reviews: {(error as any)?.message}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              No reviews found
            </div>
          ) : (
            <>
              {/* Mobile card list */}
              <div className="space-y-3 md:hidden">
                {paginatedReviews.map(review => (
                  <div key={review.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-slate-900">{review.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {format(new Date(review.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(review)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(review.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      {review.verified ? (
                        <Badge className="bg-green-600 text-xs">Verified</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Unverified</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{review.quote}</p>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Quote</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReviews.map(review => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">{review.name}</TableCell>
                        <TableCell>{renderStars(review.rating)}</TableCell>
                        <TableCell className="max-w-xs truncate">{review.quote}</TableCell>
                        <TableCell>
                          {review.verified ? (
                            <Badge className="bg-green-600">Verified</Badge>
                          ) : (
                            <Badge variant="outline">Unverified</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {format(new Date(review.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(review)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(review.id)}
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
              <div className="flex flex-col gap-2 mt-6 pt-4 border-t sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-slate-600 text-center sm:text-left">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none"
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
        title="Add New Review"
        description="Create a new customer review"
        size="lg"
      >
        <ReviewForm
          onSubmit={handleCreate}
          isLoading={isCreating}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Edit Review"
        description="Update the review details"
        size="lg"
      >
        {editingReview && (
          <ReviewForm
            onSubmit={handleUpdateSubmit}
            isLoading={isUpdating}
            defaultValues={{
              name: editingReview.name,
              quote: editingReview.quote,
              rating: editingReview.rating,
              verified: editingReview.verified,
            }}
            isEditMode
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
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
