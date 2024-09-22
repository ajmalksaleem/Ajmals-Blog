import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

const signup = () => {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex max-w-3xl mx-auto p-3 flex-col md:flex-row md:items-center gap-5">
        {/* Left-Side */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl ">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Ajmal's
            </span>{" "}
            Blog
          </Link>
          <p className="text-sm mt-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt ex
            corrupti qui aut necessitatibus accusantium eligendi. Sapiente
            assumenda ut delectus, qui minima similique quibusdam laudantium. Et
            eaque voluptatibus error ea!
          </p>
        </div>
        {/* Right-Side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div className="">
              <Label value="Your Username" className=""/>
              <TextInput type="text" placeholder="Username" id="username" />
            </div>
            <div className="">
              <Label value="Your Email" className=""/>
              <TextInput type="text" placeholder="Email" id="email" />
            </div>
            <div className="">
              <Label value="Your Password" className=""/>
              <TextInput type="text" placeholder="Password" id="password" />
            </div>
            <Button gradientDuoTone='purpleToBlue' type="submit">Sign Up</Button>
          </form>
          <div className="flex mt-5 gap-2">
            <span>Have an account?</span>
            <Link to='/sign-in' className="text-blue-500">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default signup;
