import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import moment from "moment";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const { postSlug } = useParams();
  const [post, setPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [RecentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/post/getPosts?slug=${postSlug}`);
        const { data } = res;
        setPosts(data.posts[0]);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await axios.get(`/api/post/getPosts?limit=3`);
        const { data } = res;
        setRecentPosts(data.posts);
      };
      fetchRecentPosts();
    } catch (error) {}
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  return (
    <main className="p-3 flex flex-col max-w-6xl min-h-screen mx-auto">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post?.title}
      </h1>
      <Link
        to={`/search?category=${post?.category}`}
        className="self-center mt-5"
      >
        <Button className="p-2" color="gray" pill size="xs">
          {post?.category}
        </Button>
      </Link>
      <img
        src={post?.image}
        alt={post?.title}
        className="mt-10 p-3 px-4 max-h-[600px] md:max-h-[490px] md w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-5xl">
        <span>{post && moment(post.updatedAt).format("MMMM DD, YYYY")}</span>
        <span className="italic">
          {(post?.content?.length / 1000).toFixed(0)}-min read
        </span>
      </div>
      <div
        className="p-3 max-w-5xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post?.content }}
      ></div>
      <CommentSection postId={post._id} />
      <div className="flex flex-col justify-center items-center mb-5 ">
        <h1 className="text-xl my-5">Recent Articles</h1>
        <div className="flex gap-7 flex-wrap justify-center">
          {RecentPosts &&
            RecentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
