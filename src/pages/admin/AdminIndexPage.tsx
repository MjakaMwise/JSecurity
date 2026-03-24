import { Navigate } from 'react-router-dom'

export function AdminIndexPage() {
  // Redirect to blog management
  return <Navigate to="/admin/blog" replace />
}
