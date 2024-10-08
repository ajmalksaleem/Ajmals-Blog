import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {About, Signin, Signup, Home} from './pages/index.pages'
import Header from './components/Header'
import Footer from './components/Footer'


const App = () => {
  return (
    <BrowserRouter>
    <Header/>
<Routes>
<Route path="/about" element={<About/>}/>
<Route path="/sign-in" element={<Signin/>}/>
<Route path="/sign-up" element={<Signup/>}/>
<Route path="/" element={<Home/>}/>

</Routes>
<Footer/>
    </BrowserRouter>
  )
}

export default App