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
import { BlogPostCreate, BlogPostUpdate } from '@/api/blog'

const blogFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(500),
  category: z.string().min(1, 'Category is required'),
  author: z.string().min(1, 'Author is required'),
  read_time: z.string().min(1, 'Read time is required'),
  tags: z.string().optional(),
  published: z.boolean().default(false),
})

type BlogFormValues = z.infer<typeof blogFormSchema>

interface BlogFormProps {
  onSubmit: (data: BlogPostCreate | BlogPostUpdate) => Promise<void>
  isLoading: boolean
  defaultValues?: Partial<BlogFormValues>
  isEditMode?: boolean
}

const CATEGORIES = ['Tech', 'Design', 'Business', 'Marketing', 'Development']
const READ_TIMES = ['3 min', '5 min', '8 min', '10 min', '15 min']

export function BlogForm({ onSubmit, isLoading, defaultValues, isEditMode }: BlogFormProps) {
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: '',
      author: '',
      read_time: '',
      tags: '',
      published: false,
      ...defaultValues,
    },
  })

  const handleSubmit = async (values: BlogFormValues) => {
    const tags = values.tags
      ? values.tags.split(',').map(tag => tag.trim())
      : []

    await onSubmit({
      ...values,
      tags,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog post title" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="post-slug" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>URL-friendly identifier</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category & Author */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="Author name" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Read Time */}
        <FormField
          control={form.control}
          name="read_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Read Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select read time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {READ_TIMES.map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Excerpt */}
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the post"
                  {...field}
                  disabled={isLoading}
                  rows={3}
                />
              </FormControl>
              <FormDescription>{field.value?.length || 0} / 500 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Full blog post content"
                  {...field}
                  disabled={isLoading}
                  rows={8}
                />
              </FormControl>
              <FormDescription>{field.value?.length || 0} characters minimum 50</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="Separate with commas: tag1, tag2, tag3"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>Comma-separated list of tags</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Published */}
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <FormLabel>Publish Post</FormLabel>
                <FormDescription>Make this post visible to readers</FormDescription>
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
              isEditMode ? 'Update Post' : 'Create Post'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
