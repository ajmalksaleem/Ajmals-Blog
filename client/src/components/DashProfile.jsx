import { Alert, Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {getDownloadURL, getStorage, ref, uploadBytesResumable,} from "firebase/storage";
import { useForm } from "react-hook-form";
import axios from "axios";
import { signInStart,signInSuccess, signInFailure, clearUserFailure,clearUserStart,clearUserSuccess } from "../redux/user/userSlice"; 
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import { FaCameraRetro } from "react-icons/fa";

const DashProfile = () => {
  const { currentUser,error,loading } = useSelector((state) => state.user); 
  const [imageFile, setImageFile] = useState(null);
  const [filePercentage, setfilePercentage] = useState(null);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [profilePicture, setprofilePicture] = useState(null);
  const [showModal, setShowModal] = useState(false)
  const filepickRef = useRef();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors,dirtyFields},
  } = useForm({ mode: "onChange", defaultValues : {...currentUser} });

const dispatch = useDispatch()

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage(imageFile);
    }
  }, [imageFile]);

  const uploadImage = async (imageFile) => {
    setfileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on("state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfilePercentage(progress.toFixed(0));
      },
      (error) => {
        setfileUploadError(true);
        setfilePercentage(null);
        setImageFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setfilePercentage(null);
          setprofilePicture(downloadURL);
        });
      }
    );
  };

  const handleUpdate = async (formData) => {
    const updatedValues = {}
    if(dirtyFields.username){
      updatedValues.username = formData.username
    }
    if(dirtyFields.email){
      updatedValues.email = formData.email
    }
    if(dirtyFields.password){
      updatedValues.password = formData.password
    }
    if(profilePicture){
      updatedValues.profilePicture = profilePicture
    }
    reset({},{keepValues: true})
    if(Object.keys(updatedValues).length === 0) return ;
    try {
      dispatch(signInStart())
      const res = await axios.put(`/api/user/update/${currentUser._id}`,{
        ...updatedValues
      })
      const data = res.data;
      dispatch(signInSuccess(data))
    } catch (error) {
      if(error.response){
        dispatch(signInFailure(error.response.data.message))
       }else{
         dispatch(signInFailure(error.message))
       }
    }
  };

  const handleDeleteAccount = async()=>{
    setShowModal(false)
    try {
      dispatch(clearUserStart())
      const res = await axios.delete(`/api/user/delete/${currentUser._id}`)
      const data = res.data;
      dispatch(clearUserSuccess(data))
    } catch (error) {
      if(error.response){
        dispatch(clearUserFailure(error.response.data.message))
       }else{
         dispatch(clearUserFailure(error.message))
       }
    }
  }
 
  return (
    <div className="mx-auto max-w-lg w-full p-3 ">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(handleUpdate)}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filepickRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filepickRef.current.click()}
        >
          {filePercentage && (
            <CircularProgressbar
              value={filePercentage || 0}
              text={`${filePercentage}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${filePercentage / 100})`,
                },
              }}
            />
          )}
          <img
            src={profilePicture || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
              ${filePercentage && filePercentage < 100 && "opacity-60"}
              `}
          />
            <div className="absolute inset-0 rounded-full  opacity-0 transition-opacity duration-300 bg-black bg-opacity-50 hover:opacity-100"
                        ><FaCameraRetro className="w-6 h-6 text-white mx-auto my-12 " />
                        </div>
        </div>
        {fileUploadError && (
          <Alert color="failure">
            Could not upload image (File must be less than 2MB)
          </Alert>
        )}
        <Label value="Your Username" />
        <TextInput
          type="text"
          placeholder="Username"
          {...register("username", {
            required: "username is required",
            validate: {
              noSpaces: (value) => {
                const trimmedValue = value.trim();
                return (
                  (trimmedValue !== "" &&
                    trimmedValue === value &&
                    !trimmedValue.includes(" ")) ||
                  "Username cannot contain spaces"
                );
              },
              lowercase: (value) => {
                return (
                  value === value.toLowerCase() ||
                  "Username must be in lowercase"
                );
              },
            },
          })}
        />
        {errors.username && (
          <p className="text-sm mt-2 text-red-500">{errors.username.message}</p>
        )}
        <Label value="Your email" />
        <TextInput
          type="email"
         
          placeholder="email"
          {...register("email", {
            required: "email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          })}
        />
        {errors.email && (
          <p className="text-sm mt-2 text-red-500">{errors.email?.message}</p>
        )}
        <Label value="Your paswword" />
        <TextInput type="password" placeholder="Password" 
         {...register("password", {
          minLength: {
            value :4,
            message : "Password must be more than 4 characters"
          }
        })}
        />
         {errors.password && (
                <p className="text-sm mt-2 text-red-500">
                  {errors.password?.message}
                </p>
              )}
        <Button type="submit"  gradientDuoTone="purpleToBlue" className="mt-4">
          Update
        </Button>
        <Button
          gradientDuoTone="pinkToOrange"
          className="mb-5"
          outline
          type="button"
          onClick={()=>setShowModal(true)}
        >
          Delete Account
        </Button>
      </form>
      {error && (
        <Alert color='failure' className="mb-4">{error}</Alert>
      )}
      <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
              <Modal.Header/>
              <Modal.Body>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
                  <h3 className="mb-5 text-lg text-gray-600">Are you sure that you want to delete your account?</h3>
                </div>
                <div className="flex justify-center gap-4">
                  <Button color='success' onClick={()=>setShowModal(false)}>No, Cancel</Button>
                  <Button color='failure' onClick={handleDeleteAccount}>Yes, i'm sure</Button>
                </div>
              </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
