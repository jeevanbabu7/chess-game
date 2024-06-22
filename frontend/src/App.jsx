import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css'
import { Button } from '@mui/material'
import Landing from "./pages/Landing"
import Game from "./pages/Game"
import Auth from "./pages/Auth"
function App() {


  return (
    <>

      <BrowserRouter>
   
        <Routes>
          <Route path='/' element={<Auth />}/>
          <Route path='/home' element={<Landing />}/>
          <Route path='/game' element={<Game />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
