import { Button, Label, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="mx-auto max-w-lg w-full p-3 ">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-2 ">
        <div className="w-32 h-32 self-center mb-5">
          <img
            src={currentUser.profilePicture}
            alt="user"
            className="w-full h-full border-8 border-[lightgray] object-cover rounded-full "
          />
        </div>
        <Label value="Your Username"  />
        <TextInput type="text" defaultValue={currentUser.username} placeholder="Username"/>
        <Label value="Your email"  />
        <TextInput type="email" defaultValue={currentUser.email} placeholder="email"/>
        <Label value="Your paswword"  />
        <TextInput type="password"  placeholder="Password"/>
        <Button type="submit" gradientDuoTone='purpleToBlue' className="mt-4">Update</Button>
        <Button gradientDuoTone="pinkToOrange" className="mb-10" outline type="button">Delete Account</Button>
      </form>
      
    </div>
  );
};

export default DashProfile;
