import { BrowserRouter, Routes, Route } from "react-router-dom";
import { About, Signin, Signup, Home, Dashboard, CreatePost, UpdatePost,PostPage, Search } from "./pages/index.pages";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoutes from "./components/privateRoutes";
import PublicRoutes from "./components/PublicRoutes";
import AdminRoutes from "./components/AdminRoutes";
import ScrolltoTop from "./components/ScrolltoTop";
import Margin from "./components/Margin";

const App = () => {
  return (
    <BrowserRouter>
    <ScrolltoTop/>
      <Header/>
      <Routes>
        <Route element={<Margin />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search/>} />
        <Route path="/post/:postSlug" element={<PostPage/>} />
        <Route element={<PublicRoutes />}>
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route element={<AdminRoutes />}>
            <Route path="/update-post/:postId" element={<UpdatePost/>} />
            <Route path="/createpost" element={<CreatePost/>} />
          </Route>
        </Route>
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
