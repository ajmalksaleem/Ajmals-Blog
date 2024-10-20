import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { clearUserSuccess } from "../redux/user/userSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoSunny } from "react-icons/io5";

const header = () => {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [SearchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const UrlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = UrlParams.get('searchTerm')
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl)
    }
    
  }, [location.search]);

  const handleSubmit = async(e)=>{
    e.preventDefault()
    const UrlParams = new URLSearchParams(location.search)
    UrlParams.set('searchTerm', SearchTerm)
    const SearchQuery = UrlParams.toString()
    navigate(`/search?${SearchQuery}`)
  }

  const handleSignout = async () => {
    try {
      const res = await axios.post("/api/user/signout");
      const { data } = res;
      dispatch(clearUserSuccess());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar  className="border-b-2 fixed w-full h-16 z-50 flex flex-shrink items-center">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-[10px] sm:text-xl font-semibold dark:text-white"
      >
        <span className="p-3 m-1 text-lg sm:hidden py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
        T
        </span>
        <span className="px-2 py-1 sm:inline hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
        Turbo
        </span>{" "}
     <span className="sm:inline hidden">Tribune</span>   
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline "
          value={SearchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
        />
      </form>
      <div className="flex gap-2 sm:gap-2 md:order-2">
      <Button className="w-10 h-10 lg:hidden " color="gray" pill onClick={()=>navigate('/search')}>
        <AiOutlineSearch className="mt-0.5 " />
      </Button>
        <Button
          className="inline focus:ring-0 w-12 h-10"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'dark' ? <IoSunny/> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>SignOut</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline pill>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={Link} active={path === "/"} to="/">
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} active={path === "/about"} to="/about">
          About
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default header;
