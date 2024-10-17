import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setcommentError] = useState(null);
  const [PostComments, setPostComments] = useState([]);
  const [refreshComment, setrefreshComment] = useState(false);
  const navigate = useNavigate();

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
      setrefreshComment(true);
    } catch (error) {
      if (error.response) {
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
      console.log(data);
    } catch (error) {}
  };

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
                <div className="">
                  <span className="font-bold mr-3 text-xs truncate ">
                    {comment.userId?.username ?? "Anonymous User"}
                  </span>
                  <span className="text-gray=500 text-xs">
                    {moment(comment.createdAt).fromNow()}
                  </span>
                </div>
                <p className="text-gray-500 pb-1 dark:text-gray-300">
                  {comment.content}
                </p>
                <div className="flex text-xs items-center gap-2 border-t max-w-fit mt-2 pt-2 dark:border-gray-600 border-gray-300">
                  <button
                    onClick={() => handleLike(comment._id)}
                    className={`text-gray-500 hover:text-blue-500
                      ${
                        currentUser &&
                        comment.likes.includes(currentUser._id) &&
                        "!text-blue-500"
                      }`}
                    type="button"
                  >
                    <FaThumbsUp className="text-sm" />
                  </button>
                  <p className="text-gray-500">
                    {comment.numberOfLikes > 0 &&
                      comment.numberOfLikes +
                        " " +
                        (comment.numberOfLikes === 1 ? "like" : "likes")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CommentSection;
