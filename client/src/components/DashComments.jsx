import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import moment from "moment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashComments = () => {
  const [Comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [DeleteCommentId, setDeleteCommentId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comment/getallcomments`);
        const { data } = res;
        setComments(data.comments);
        if (data.comments.length < 9) setShowMore(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowmore = async () => {
    const startIndex = Comments.length;
    try {
      const res = await axios.get(
        `/api/comment/getallcomments?startIndex=${startIndex}`
      );
      const { data } = res;
      setComments((prev) => [...prev, ...data.comments]);
      if (data?.comments?.length < 9) setShowMore(false);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
      } else {
        console.log(error.message);
      }
    }
  };

  const handleCommentDelete = async () => {
    setShowModal(false);
    try {
      await axios.delete(`/api/comment/deletecomment/${DeleteCommentId}`);
      setComments((prev) =>
        prev.filter((comment) => comment._id != DeleteCommentId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      className="table-auto overflow-x-scroll md:mx-auto size-full p-3 
    scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 
    dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500
    "
    >
      {currentUser.isAdmin && Comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head className="dark:text-gray-300">
              <Table.HeadCell>DATE UPDATED</Table.HeadCell>
              <Table.HeadCell>COMMENT CONTENT</Table.HeadCell>
              <Table.HeadCell>NO OF LIKES</Table.HeadCell>
              <Table.HeadCell>POSTID</Table.HeadCell>
              <Table.HeadCell>USERID</Table.HeadCell>
              <Table.HeadCell>DELETE</Table.HeadCell>
            </Table.Head>
            {Comments.map((comment) => (
              <Table.Body key={comment._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <Table.Cell>
                    {moment(comment.updatedAt).format("MMM DD, YYYY")}
                  </Table.Cell>
                  <Table.Cell>
                    <p>{comment.content}</p>
                  </Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setDeleteCommentId(comment._id);
                      }}
                      className="text-red-500 font-medium hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
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
        <p>No Comments</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-600">
              Are you sure that you want to delete this comment?
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="success" onClick={() => setShowModal(false)}>
              No, Cancel
            </Button>
            <Button color="failure" onClick={handleCommentDelete}>
              Yes, i'm sure
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashComments;
