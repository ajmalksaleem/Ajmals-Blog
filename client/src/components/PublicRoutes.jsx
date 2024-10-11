import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const PublicRoutes = () => {
    const {currentUser} = useSelector(state=>state.user)
  return !currentUser ? <Outlet/> : <Navigate to={'/dashboard?tab=profile'}/>  
}

export default PublicRoutes