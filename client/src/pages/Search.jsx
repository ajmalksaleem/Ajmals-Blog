import axios from "axios";
import { Button, Select, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from '../components/PostCard'
import carBodyTypes from "../assets/Data";

const Search = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [SidebarData, setSidebarData] = useState({
    searchTerm: "",
    category: 'all',
    sort: "desc",
  });
  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    const UrlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = UrlParams.get("searchTerm") || "";
    const sortFromUrl = UrlParams.get("sort") || "desc";
    const categoryFromUrl = UrlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...SidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const SearchQuery = UrlParams.toString();
        const res = await axios.get(`api/post/getPosts?${SearchQuery}`);
        const { data } = res;
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', SidebarData.searchTerm);
    urlParams.set('sort', SidebarData.sort);
    if(SidebarData.category){
        urlParams.set('category', SidebarData.category);
    }
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  const handleShowMore = async () => {
    const startIndex =  posts.length;;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await axios.get(`/api/post/getposts?${searchQuery}`);
      const {data} = res;
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className=" p-7 border-b md:border-r md:min-h-screen border-gray-500 ">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Searh Term :{" "}
            </label>
            <TextInput
              placeholder="Search.."
              value={SidebarData.searchTerm}
              onChange={(e) =>
                setSidebarData({ ...SidebarData, searchTerm: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="font-semibold">Sort : </label>
            <Select
              value={SidebarData.sort}
              onChange={(e) =>
                setSidebarData({ ...SidebarData, sort: e.target.value })
              }
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex gap-2 items-center">
            <label className="font-semibold">Category : </label>
            <Select
              value={SidebarData.category}
              onChange={(e) =>
                setSidebarData({ ...SidebarData, category: e.target.value })
              }
            >
                <option value="all">All category</option>
              <option value="uncategorized">uncategorized</option>
              {carBodyTypes.map((bdtype)=>(
            <option key={bdtype.id} value={bdtype.type}>{bdtype.type}</option>
            ))}
            </Select>
          </div>
          <Button type="submit" gradientDuoTone="purpleToBlue" outline>
            Submit
          </Button>
        </form>
      </div>
      <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
      ) : (
        <>
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">Post Results :</h1>
        <div className='p-7 flex flex-wrap gap-6 sm:ml-10 mt-10'>
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
           {!loading &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
             {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default Search;
