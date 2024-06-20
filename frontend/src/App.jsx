import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css'
import { Button } from '@mui/material'
import Landing from "./pages/Landing"
import Game from "./pages/Game"
function App() {


  return (
    <>

      <BrowserRouter>
   
        <Routes>
          <Route path='/' element={<Landing />}/>
          <Route path='/game' element={<Game />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
