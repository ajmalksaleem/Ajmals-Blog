import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import moment from "moment";
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import { FaTimes, FaCheck } from "react-icons/fa";
import { clearUserSuccess } from "../redux/user/userSlice";
import toast from "react-hot-toast";

const DashUsers = () => {
  const [Users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState(null)
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `/api/user/getusers`
        );
        const { data } = res;
        setUsers(data.users);
        if (data.users.length < 9) setShowMore(false);
      } catch (error) {
        if(error.response.data.message === 'NoToken'){
          dispatch(clearUserSuccess())
          return
        }
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  },[currentUser._id]);

  const handleShowmore = async () => {
    const startIndex = Users.length;
    try {
      const res = await axios.get(
        `/api/user/getusers&startIndex=${startIndex}`
      );
      const { data } = res;
      setUsers((prev) => [...prev, ...data.users]);
      if (data?.users?.length < 9) setShowMore(false);
    } catch (error) {
      if(error.response){
        console.log(error.response.data.message)
       }else{
         console.log(error.message)
       }
    }
  };

  const handleUserDelete = async()=>{
    setShowModal(false)
      try {
        await axios.delete(`/api/user/delete/${deleteUserId}`)
        setUsers(prev=>prev.filter((user)=>user._id != deleteUserId))
      } catch (error) {
        toast.error(error.response.data.message)
        if(error.response.data.message === 'NoToken'){
          dispatch(clearUserSuccess())
          return
        }
        console.log(error.message)
      }
  }

  return (
    <div
      className="table-auto overflow-x-scroll md:mx-auto size-full p-3 
    scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 
    dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500
    "
    >
      {currentUser.isAdmin && Users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Profile Picture</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
            </Table.Head>
            {Users.map((user) => (
              <Table.Body key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                  <Table.Cell>
                    {moment(user.createdAt).format("MMM DD, YYYY")}
                  </Table.Cell>
                  <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-12 h-12 object-cover rounded-full bg-gray-500"
                      />
                  </Table.Cell>
                  <Table.Cell>
                      {user.email}
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>
                    <span onClick={()=>{
                      setShowModal(true)
                      setDeleteUserId(user._id)
                    }} 
                      className="text-red-500 font-medium hover:underline cursor-pointer">
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                      {user.isAdmin? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500"/> }
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              className="w-full text-teal-500 self-center text-sm py-7"
              onClick={handleShowmore}
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No Users</p>
      )}
      <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
              <Modal.Header/>
              <Modal.Body>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
                  <h3 className="mb-5 text-lg text-gray-600">Are you sure that you want to delete this post?</h3>
                </div>
                <div className="flex justify-center gap-4">
                  <Button color='success' onClick={()=>setShowModal(false)}>No, Cancel</Button>
                  <Button color='failure' onClick={handleUserDelete}>Yes, i'm sure</Button>
                </div>
              </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashUsers;
