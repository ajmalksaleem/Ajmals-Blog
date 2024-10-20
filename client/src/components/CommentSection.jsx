import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { clearUserSuccess } from "../redux/user/userSlice";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setcommentError] = useState(null);
  const [PostComments, setPostComments] = useState([]);
  const [refreshComment, setrefreshComment] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editValue, seteditValue] = useState('');
  const [editCommentId, seteditCommentId] = useState(null);
  const [showdeleteModal, setshowdeleteModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comment/getcomments/${postId}`);
        const { data } = res;
        setPostComments(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchComments();
  }, [postId, refreshComment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length < 1 || comment.length > 200) return;
    try {
      await axios.post("/api/comment/create", {
        content: comment,
        userId: currentUser._id,
        postId,
      });
      setComment("");
      setrefreshComment((prevrefreshComment) => !prevrefreshComment);;
    } catch (error) {
      if (error.response) {
        if(error.response.data.message === 'NoToken'){
          dispatch(clearUserSuccess())
          return
        }
        setcommentError(error.response.data.message);
      } else {
        setcommentError(error.message);
      }
    }
  };

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await axios.put(`/api/comment/likecomment/${commentId}`);
      const { data } = res;
      setPostComments(
        PostComments.map((likedcomment) =>
          likedcomment._id === commentId
            ? {
                ...likedcomment,
                likes: data.likes,
                numberOfLikes: data.likes.length,
              }
            : likedcomment
        )
      );
    } catch (error) {
      if(error.response.data.message === 'NoToken'){
        dispatch(clearUserSuccess())
        navigate('/sign-in')
        return
      }
    }
  };
  
  const handlecommentEdit = (commentId,commentcontent)=>{
      setShowModal(true)
      seteditValue(commentcontent)  
      seteditCommentId(commentId)   
  }

  const editComment = async()=>{
    try {
      if (editValue < 1 || editValue > 200) return;
        try {
          const res = await axios.put(`/api/comment/editcomment/${editCommentId}`,{
            content : editValue
          })
          const {data} = res;
          setPostComments(
            PostComments.map((editedcomment) =>
              editedcomment._id === editCommentId
                ? {
                    ...editedcomment,
                    content: data.content,
                  }
                : editedcomment
            )
          );
          setShowModal(false)
          seteditValue('')
          seteditCommentId(null)
        } catch (error) {
          if(error.response.data.message === 'NoToken'){
            dispatch(clearUserSuccess())
            navigate('/sign-in')
            return
          }
        }
    } catch (error) {
      
    }
  };

  const handleCommentDelete = async()=>{
    try {
      const res = await axios.delete(`/api/comment/deletecomment/${editCommentId}`)
      const{data} = res;
      setPostComments(PostComments.filter((comment) => comment._id !== data._id));
      seteditCommentId('')
      setshowdeleteModal(false)
    } catch (error) {
      if(error.response.data.message === 'NoToken'){
        dispatch(clearUserSuccess())
        navigate('/sign-in')
        return
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex  justify-center items-center text-gray-500 text-sm dark:text-gray-300">
          <p className="mr-3">Signed in as</p>
          <img
            src={currentUser.profilePicture}
            className="h-5 w-5 rounded-full mr-1 object-cover"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs hover:underline dark:text-cyan-400 text-cyan-600"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex justify-center text-gray-500 text-sm dark:text-gray-300 my-5">
          You must be signed in to comment
          <Link
            className="dark:text-cyan-400 text-cyan-600 hover:underline ml-2"
            to={"/sign-in"}
          >
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3 mt-5"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between mt-5 items-center">
            <p className="text-sm text-gray-500">
              {200 - comment.length + " "}words remaining
            </p>
            <Button type="submit" outline gradientDuoTone="purpleToBlue">
              Comment
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {PostComments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className=" flex gap-2 items-center my-5 text-sm">
            <p>Comments</p>
            <div className="border border-gray-400 px-3 rounded-sm py-1">
              <p className="">{PostComments.length}</p>
            </div>
          </div>
          {PostComments.map((comment) => (
            <div
              className="flex gap-2 border-b p-4 dark:border-gray-600 "
              key={comment._id}
            >
              <div className="flex-shrink-0 mr-1">
                <img
                  src={comment.userId.profilePicture}
                  alt="image"
                  className="h-10 w-10 rounded-full bg-gray-200"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-bold  text-xs truncate ">
                    {comment.userId?.username ?? "Anonymous User"}
                  </span>
                  {comment.userId?.isAdmin && <MdVerified className="text-xs mx-1 text-blue-500 "/>
                  }
                  <span className="text-gray=500 text-xs ml-3">
                    {moment(comment.createdAt).fromNow()}
                  </span>
                </div>
                <p className="text-gray-500 pb-1 dark:text-gray-300">
                  {comment.content}
                </p>
                <div className="flex text-xs items-center gap-2 border-t max-w-fit mt-2 pt-2 dark:border-gray-600 border-gray-300">
                  <button
                    onClick={() => handleLike(comment._id)}
                    className={`text-gray-500 md:hover:text-blue-500
                      ${
                        currentUser &&
                        comment.likes.includes(currentUser._id) &&
                        "!text-blue-500"
                      }`}
                    type="button"
                  >
                    <FaThumbsUp className="text-sm" />
                  </button>
                  <p className="text-gray-500 dark:text-gray-400">
                    {comment.numberOfLikes > 0 &&
                      comment.numberOfLikes +
                        " " +
                        (comment.numberOfLikes === 1 ? "like" : "likes")}
                  </p>
                  {(comment.userId?._id === currentUser?._id) && (
                    <button onClick={()=>handlecommentEdit(comment._id,comment.content)} className="hover:text-blue-500 text-gray-700 dark:text-gray-300 dark:hover:text-blue-500">
                      edit
                    </button>
                  )}
                  {(comment.userId?._id === currentUser?._id || currentUser?.isAdmin) && (
                    <button onClick={()=>{
                    setshowdeleteModal(true)
                    seteditCommentId(comment._id)
                    }} className="hover:text-blue-500 text-gray-700 dark:text-gray-300 dark:hover:text-blue-500">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='lg'>
              <Modal.Header className="mx-auto">EDIT COMMENT</Modal.Header>
              <Modal.Body>
                <div className="">
                <Textarea
                value={editValue}
                 rows="4"
                 maxLength="200"
                onChange={(e)=>seteditValue(e.target.value)}
                />
                <div className="flex justify-center gap-4 mt-3">
                <Button color='failure' onClick={()=>setShowModal(false)}>Cancel</Button>
                <Button color='success'onClick={()=>editComment()}>Edit Comment</Button>
                </div>
                </div>
              </Modal.Body>
      </Modal>
      <Modal show={showdeleteModal} onClose={()=>setshowdeleteModal(false)} popup size='md'>
              <Modal.Header/>
              <Modal.Body>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
                  <h3 className="mb-5 text-lg text-gray-600">Are you sure that you want to delete this Comment?</h3>
                </div>
                <div className="flex justify-center gap-4">
                  <Button color='success' onClick={()=>setshowdeleteModal(false)}>Cancel</Button>
                  <Button color='failure' onClick={handleCommentDelete}>Yes, Delete</Button>
                </div>
              </Modal.Body>
      </Modal>
    </div>
  );
};

export default CommentSection;
