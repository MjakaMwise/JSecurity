import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'

const reviewFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  quote: z.string().min(10, 'Quote must be at least 10 characters').max(500),
  rating: z.number().min(1).max(5),
  verified: z.boolean().default(false),
})

type ReviewFormValues = z.infer<typeof reviewFormSchema>

interface ReviewFormProps {
  onSubmit: (data: ReviewFormValues) => Promise<void>
  isLoading: boolean
  defaultValues?: Partial<ReviewFormValues>
  isEditMode?: boolean
}

export function ReviewForm({ onSubmit, isLoading, defaultValues, isEditMode }: ReviewFormProps) {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      name: '',
      quote: '',
      rating: 5,
      verified: false,
      ...defaultValues,
    },
  })

  const handleSubmit = async (values: ReviewFormValues) => {
    await onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reviewer Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Rating */}
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value.toString()}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating}⭐ - {'★'.repeat(rating)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quote */}
        <FormField
          control={form.control}
          name="quote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Quote</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Customer review text"
                  {...field}
                  disabled={isLoading}
                  rows={4}
                />
              </FormControl>
              <FormDescription>{field.value?.length || 0} / 500 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Verified */}
        <FormField
          control={form.control}
          name="verified"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <FormLabel>Verified Review</FormLabel>
                <FormDescription>Mark this as a verified customer review</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" type="button" disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditMode ? 'Update Review' : 'Create Review'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
