import { toast } from 'sonner'

export const notificationAPI = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 3000,
    })
  },

  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 4000,
    })
  },

  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 3000,
    })
  },

  loading: (message: string) => {
    return toast.loading(message)
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    })
  },
}
