import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {About, Signin, Signup, Home,Dashboard} from './pages/index.pages'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoutes from './components/privateRoutes'


const App = () => {
  return (
    <BrowserRouter>
    <Header/>
<Routes>
<Route path="/about" element={<About/>}/>
<Route path="/sign-in" element={<Signin/>}/>
<Route path="/sign-up" element={<Signup/>}/>
<Route element={<PrivateRoutes/>}>
<Route path="/dashboard" element={<Dashboard/>}/>
</Route>
<Route path="/" element={<Home/>}/>

</Routes>
<Footer/>
    </BrowserRouter>
  )
}

export default App