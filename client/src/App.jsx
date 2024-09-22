import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {About, Signin, Signup, Home} from './pages/index.pages'
import Header from './components/Header'


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
    </BrowserRouter>
  )
}

export default App