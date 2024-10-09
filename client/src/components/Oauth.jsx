import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

const Oauth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth(app);
  const handleGoogleclick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try { 
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const res = await axios.post("/api/auth/google", {
        name: resultFromGoogle.user.displayName,
        email: resultFromGoogle.user.email,
        googlePhotoUrl: resultFromGoogle.user.photoURL,
      });
      const data = res.data;
      console.log(data)
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log(error)
     // dispatch(signInFailure(error.message))
    }
  };
  return (
    <Button
      gradientDuoTone="pinkToOrange"
      type="button"
      outline
      onClick={handleGoogleclick}
    >
      <AiFillGoogleCircle className="w-5 h-5 mr-2" /> Continue with Google
    </Button>
  );
};

export default Oauth;
