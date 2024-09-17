import {BrowserRouter, Routes, Route} from 'react-router-dom'
import About from './pages/About'
import Header from './components/Header'
const App = () => {
  return (
    <BrowserRouter>
    <Header/>
<Routes>
<Route path="/about" element={<About/>}/>
</Routes>
    </BrowserRouter>
  )
}

export default App