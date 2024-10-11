import { Sidebar } from 'flowbite-react'
import {HiArrowSmRight, HiUser} from 'react-icons/hi'
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");
  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const tabFromUrl = urlparams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
             <Link to='/dashboard?tab=profile'>  
             <Sidebar.Item as='div' active={tab==='profile'} icon={HiUser} label={'User'} labelColor='dark'>Profile</Sidebar.Item>
             </Link>
                <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer'>SignOut</Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar