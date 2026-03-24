import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Loader2 } from 'lucide-react'

const userFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  role: z.enum(['editor', 'admin', 'super_admin']),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormProps {
  onSubmit: (data: UserFormValues) => Promise<void>
  isLoading: boolean
  defaultValues?: Partial<UserFormValues>
  isEditMode?: boolean
}

const ROLES = [
  { value: 'editor', label: 'Editor - View & edit content' },
  { value: 'admin', label: 'Admin - Full admin access' },
  { value: 'super_admin', label: 'Super Admin - All permissions' },
]

export function UserForm({ onSubmit, isLoading, defaultValues, isEditMode }: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      role: 'editor',
      ...defaultValues,
    },
  })

  const handleSubmit = async (values: UserFormValues) => {
    const submitData = {
      ...values,
      ...(isEditMode && !values.password && { password: undefined }),
    }
    await onSubmit(submitData as UserFormValues)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Username & Email */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="username"
                    {...field}
                    disabled={isLoading || isEditMode}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {isEditMode ? 'Password (leave empty to keep current)' : 'Password'}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={isEditMode ? '••••••••' : 'Enter password'}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              {isEditMode && (
                <FormDescription>
                  Leave blank to keep the current password
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ROLES.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Define what permissions this user has in the admin panel
              </FormDescription>
              <FormMessage />
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
              isEditMode ? 'Update User' : 'Create User'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
