import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import moment from "moment";
import { Link } from "react-router-dom";
import {HiOutlineExclamationCircle} from 'react-icons/hi'

const DashPosts = () => {
  const [Userposts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false)
  const [deletePostId, setDeletePostId] = useState(null)
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `/api/post/getPosts?userId=${currentUser._id}`
        );
        const { data } = res;
        setUserPosts(data.posts);
        if (data.posts.length < 9) setShowMore(false);
      } catch (error) {}
    };
    if (currentUser.isAdmin) {
      fetchPost();
    }
  }, [currentUser._id]);

  const handleShowmore = async () => {
    const startIndex = Userposts.length;
    try {
      const res = await axios.get(
        `/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const { data } = res;
      setUserPosts((prev) => [...prev, ...data.posts]);
      if (data.posts.length < 9) setShowMore(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePostDelete = async()=>{
    setShowModal(false)
      try {
        await axios.delete(`/api/post/deletepost/${deletePostId}/${currentUser._id}`)
        setUserPosts(prev=>prev.filter((post)=>post._id != deletePostId))
      } catch (error) {
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
      {currentUser.isAdmin && Userposts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell><span>Edit</span></Table.HeadCell>
            </Table.Head>
            {Userposts.map((post) => (
              <Table.Body>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                  <Table.Cell>
                    {moment(post.updatedAt).format("MMM DD, YYYY")}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/post/${post.slug}`}
                      className="truncate font-medium text-gray-900 dark:text-white"
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span onClick={()=>{
                      setShowModal(true)
                      setDeletePostId(post._id)
                    }} 
                      className="text-red-500 font-medium hover:underline cursor-pointer">
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
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
        <p></p>
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
                  <Button color='failure' onClick={handlePostDelete}>Yes, i'm sure</Button>
                </div>
              </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashPosts;
