import {getDownloadURL, getStorage, ref, uploadBytesResumable,} from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [file, SetFile] = useState(null);
  const [imageUploadProgress, setImageUploadprogress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setpublishError] = useState('');
  const [imagelink, setImagelink] = useState(null);
  const [quilData, setQuilData] = useState(null);

  const { register, handleSubmit, formState: {errors}} = useForm({ mode: "onChange" });
  const {currentUser} = useSelector(state=>state.user)
  const navigate = useNavigate()

  const handleImageupload = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on( "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadprogress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(
            "image upload failed | size should be less than 2 mb"
          );
          setImageUploadprogress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadprogress(null);
            setImageUploadError(null);
            setImagelink(downloadURL);
          });
        }
      );
    } catch (error) {
        console.log(error)
      setImageUploadError("image upload filed | size should be less than 2 mb");
    }
  };

  const handleCreatePost = async(postData)=>{
        try {
            const res = await axios.post('/api/post/create',{
                ...postData, ...quilData, image : imagelink, userId : currentUser._id
            })
            const{data} = res;
            navigate(`/post/${data.slug}`)
        } catch(error) {
            if(error.response){
                setpublishError(error.response.data.message)
               }else{
                setpublishError(error.message)
               }
        }
            
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleCreatePost)}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="title"
            required
            className="flex-1"
            {...register("title", {required: "title is required"} )}
          />
          {errors.title && (
          <p className="text-sm mt-2 text-red-500">{errors.title.message}</p>
        )}
          <Select {...register("category")}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React</option>
            <option value="mongodb">mongodb</option>
            <option value="nodejs">Nodejs</option>
            <option value="css">css</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => SetFile(e.target.files[0])}
          />
          <Button
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleImageupload}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="h-16 w-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {imagelink && <img src={imagelink} alt="upload" className="w-full h-72 object-cover"/>}
        <ReactQuill
        theme='snow'
          placeholder="Write something"
          className="h-72 mb-12"
          required
          onChange={(value)=>{setQuilData({content:value})}}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" className="mb-3">
          Publish
        </Button>
        {publishError && (
            <Alert className="mb-6" color='failure'>{publishError}</Alert>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
