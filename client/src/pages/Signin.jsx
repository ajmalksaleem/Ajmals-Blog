import { Alert, Button, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { signInStart, signInFailure, signInSuccess } from "../redux/user/userSlice";
import { useDispatch , useSelector} from "react-redux";
import Oauth from "../components/Oauth";

const Signin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {loading : Loading, error :errorMessage } = useSelector(state=>state.user)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (formData) => {
    try {
      dispatch(signInStart())
      const res = await axios.post('/api/auth/sign-in',{
        ...formData
      })
      const data = res.data
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
      if(error.response){
       dispatch(signInFailure(error.response.data.message))
      }else{
        dispatch(signInFailure(error.message))
      }
    }
  };

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
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="">
            <Label value="Your Email" className="" />
            <TextInput
              type="email"
              placeholder="Email"
              id="email"
              {...register("email", {
                required: "email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm mt-2 text-red-500">
                {errors.email?.message}
              </p>
            )}
          </div>
          <div className="">
            <Label value="Your Password" className="" />
            <TextInput
              type="password"
              placeholder="Password"
              id="password"
              {...register("password", {
                required: "password is required",
                minLength: {
                  value :4,
                  message : "Password must be more than 4 characters"
                },
              })}
            />
            {errors.password && (
              <p className="text-sm mt-2 text-red-500">
                {errors.password?.message}
              </p>
            )}
          </div>
          <Button gradientDuoTone="purpleToPink" type="submit" disabled={Loading}>
          {Loading? "Loading.." : ' Sign In'}
          </Button>
        <Oauth />
        </form>
        <div className="flex mt-5 gap-2">
          <span>Haven't registered?</span>
          <Link to="/sign-up" className="text-blue-500">
            Sign Up
          </Link>
        </div>
        {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
      </div>
    </div>
  </div>
  )
}

export default Signin