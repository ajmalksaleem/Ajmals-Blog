import { Alert, Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setcommentError] = useState(null);

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
    } catch (error) {
      if (error.response) {
        setcommentError(error.response.data.message);
      } else {
        setcommentError(error.message);
      }
    }
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
    </div>
  );
};

export default CommentSection;
