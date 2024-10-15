import { BrowserRouter, Routes, Route } from "react-router-dom";
import { About, Signin, Signup, Home, Dashboard, CreatePost, UpdatePost } from "./pages/index.pages";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoutes from "./components/privateRoutes";
import PublicRoutes from "./components/PublicRoutes";
import AdminRoutes from "./components/AdminRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<PublicRoutes />}>
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route element={<AdminRoutes />}>
            <Route path="/createpost" element={<CreatePost/>} />
            <Route path="/update-post/:postId" element={<UpdatePost/>} />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
