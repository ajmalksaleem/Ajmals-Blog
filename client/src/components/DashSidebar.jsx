import { Sidebar } from 'flowbite-react'
import {HiArrowSmRight, HiUser} from 'react-icons/hi'
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearUserSuccess } from "../redux/user/userSlice";

const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");
    const dispatch = useDispatch()
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
            <Sidebar.ItemGroup>
             <Link to='/dashboard?tab=profile'>  
             <Sidebar.Item as='div' active={tab==='profile'} icon={HiUser} label={'User'} labelColor='dark'>Profile</Sidebar.Item>
             </Link>
                <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>SignOut</Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar