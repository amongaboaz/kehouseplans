import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Loading from "./Loading"

const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  // Show loading state while checking auth session
  if (loading) return <Loading />

  // Redirect unauthenticated users to login
  if (!user) return <Navigate to="/login" replace />

  // Allow access to protected routes
  return <Outlet />
}

export default ProtectedRoute