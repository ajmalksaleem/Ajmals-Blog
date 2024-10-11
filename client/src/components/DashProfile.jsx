import { Alert, Button, Label, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [filePercentage, setfilePercentage] = useState(null);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [profilePicture, setprofilePicture] =useState(null)
  const filepickRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  }

  useEffect(() => {
    if (imageFile) {
      uploadImage(imageFile);
    }
  }, [imageFile]);

  const uploadImage = async (imageFile) => {
    setfileUploadError(null)
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfilePercentage(progress.toFixed(0));
      },
      (error) => {
        setfileUploadError(true);
        setfilePercentage(null)
        setImageFile(null)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setprofilePicture(downloadURL)
        });
      }
    );
  };

  return (
    <div className="mx-auto max-w-lg w-full p-3 ">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-2 ">
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
            <CircularProgressbar value={filePercentage || 0 } text={`${filePercentage}%`} strokeWidth={5}
            styles={{
              root : {
                width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
              },
              path:{
                stroke : `rgba(62, 152, 199, ${
                  filePercentage / 100
                })`,
              },
            }}/>
          )}
          <img
            src={profilePicture || currentUser.profilePicture}
            alt="user"
            className= { `rounded-full w-full h-full object-cover border-8 border-[lightgray]
              ${
              filePercentage &&
              filePercentage < 100 &&
              'opacity-60'
            }
              `}
          />
        </div>
        {fileUploadError &&(
        <Alert color='failure'>Could not upload image (File must be less than 2MB)</Alert>
        ) }
        <Label value="Your Username" />
        <TextInput
          type="text"
          defaultValue={currentUser.username}
          placeholder="Username"
        />
        <Label value="Your email" />
        <TextInput
          type="email"
          defaultValue={currentUser.email}
          placeholder="email"
        />
        <Label value="Your paswword" />
        <TextInput type="password" placeholder="Password" />
        <Button type="submit" gradientDuoTone="purpleToBlue" className="mt-4">
          Update
        </Button>
        <Button
          gradientDuoTone="pinkToOrange"
          className="mb-10"
          outline
          type="button"
        >
          Delete Account
        </Button>
      </form>
    </div>
  );
};

export default DashProfile;


  