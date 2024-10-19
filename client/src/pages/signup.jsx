import { Button, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios'
import { useState } from "react";
import Oauth from "../components/Oauth";

const signup = () => {
  const [Loading , setLoading] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });


  const onSubmit = async (formData) => {
    try {
      setLoading(true)
      const res = await axios.post('/api/auth/sign-up',{
        ...formData
      })
      const data = res.data
      setLoading(false)
      navigate('/sign-in')
    } catch (error) {
      
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex max-w-3xl mx-auto p-3 flex-col md:flex-row md:items-center gap-5">
        {/* Left-Side */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl ">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Turbo
            </span>{" "}
            Tribune
          </Link>
          <p className="text-sm mt-5">
          Your destination for automotive insights and news. Industry trends,
            model releases, and technological advancements at your fingertips.
            Engage with expert opinions, in-depth features, and real-time
            updates.
          </p>
        </div>
        {/* Right-Side */}
        <div className="flex-1">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="">
              <Label value="Your Username" className="" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                {...register("username", { required: "username is required",
                  validate : {
                    noSpaces: (value) => {
                    const trimmedValue = value.trim();
                    return (
                      trimmedValue !== '' &&
                      trimmedValue === value &&
                      !trimmedValue.includes(' ') ||
                      "Username cannot contain spaces"
                    );
                  },
                    lowercase: (value) => {
                      return value === value.toLowerCase() || "Username must be in lowercase";
                    },
                  },
                })}
              />
              {errors.username && (
                <p className="text-sm mt-2 text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
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
            {Loading? "Loading.." : ' Sign Up'}
            </Button>
            <Oauth/>
          </form>
          <div className="flex mt-5 gap-2">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default signup;
