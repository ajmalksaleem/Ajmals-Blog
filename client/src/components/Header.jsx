import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link,useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { clearUserSuccess } from "../redux/user/userSlice";
import axios from "axios";

const header = () => {
  const path = useLocation().pathname
  const {currentUser} =  useSelector(state=>state.user)
 const dispatch = useDispatch() 

 const handleSignout = async()=>{
    try {
      const res = await axios.post('/api/user/signout')
      const {data} = res
      dispatch(clearUserSuccess())
    } catch (error) {
      console.log(error)
    }
 }

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Ajmal's
        </span>{" "}
        Blog
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline "
        />
      </form>
      <Button className="w-12 h-10 lg:hidden aliign" color="gray" pill>
        <AiOutlineSearch className="mt-0.5" />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 inline mr-2 focus:ring-0 " color="gray" pill onClick={()=>dispatch(toggleTheme())}>
          <FaMoon/>
        </Button>
        {currentUser? (
          <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
            alt="user"
            img = {currentUser.profilePicture}
            rounded/>
          }>
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">{currentUser.email}</span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
            <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider/>
            <Dropdown.Item onClick={handleSignout}>SignOut</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline pill>
              Sign In
            </Button>
          </Link>
        ) }
        <Navbar.Toggle/>
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={Link}  active={path=== "/"} to='/'>
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} active={path=== "/projects"} to='/projects'>
         Projects
        </Navbar.Link>
        <Navbar.Link as={Link} active={path=== "/about"} to='/about'>
          About
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default header;
