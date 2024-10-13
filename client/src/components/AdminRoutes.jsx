import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const AdminRoutes = () => {
    const {currentUser} = useSelector(state=>state.user)
  return currentUser.isAdmin ? <Outlet/> : <Navigate to={'/dashboard?tab=profile'}/>
  
}

export default AdminRoutes