import { Sidebar } from 'flowbite-react'
import {HiArrowSmRight, HiDocumentText, HiUser, HiUserGroup} from 'react-icons/hi'
import { MdCreate } from "react-icons/md";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserSuccess } from "../redux/user/userSlice"; 
import { LiaComments } from "react-icons/lia";
import { RiDashboardFill } from "react-icons/ri";

const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");
    const dispatch = useDispatch()
    const {currentUser} = useSelector((state)=>state.user)

  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const tabFromUrl = urlparams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

  const handleSignout = async()=>{
    try {
      const res = await axios.post('/api/user/signout')
      const {data} = res
      dispatch(clearUserSuccess())
    } catch (error) {
      console.log(error)
    }
 }

  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
            {currentUser?.isAdmin && (
              <Link to='/dashboard?tab=dash'>  
              <Sidebar.Item as='div'  active={tab==='dash'||!tab} icon={RiDashboardFill} >Dashboard</Sidebar.Item>
              </Link>
            )}
             <Link to='/dashboard?tab=profile'>  
             <Sidebar.Item as='div' active={tab==='profile'} icon={HiUser} label={currentUser.isAdmin? 'Admin' : 'User'} labelColor='dark'>
              Profile</Sidebar.Item>
             </Link>
             {currentUser.isAdmin && (
              <>
             <Link to='/createpost'>  
             <Sidebar.Item as='div'  icon={MdCreate} >Create Post</Sidebar.Item>
             </Link>
             <Link to='/dashboard?tab=posts'>  
             <Sidebar.Item as='div' active={tab==='posts'} icon={HiDocumentText} >Posts</Sidebar.Item>
             </Link>
             <Link to='/dashboard?tab=users'>  
             <Sidebar.Item as='div' active={tab==='users'} icon={HiUserGroup} >Users</Sidebar.Item>
             </Link>
             <Link to='/dashboard?tab=comments'>  
             <Sidebar.Item as='div' active={tab==='comments'} icon={LiaComments} >Comments</Sidebar.Item>
             </Link>
             </>
             )}
                <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>SignOut</Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar