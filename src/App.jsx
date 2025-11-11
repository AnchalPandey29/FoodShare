import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Home from './pages/Home'
import AboutUs from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import ShareFood from './pages/ShareFood'
import BrowseFood from './pages/BrowseFood'
import FoodDetails from './pages/FoodDetails'
import Checkout from './pages/Checkout'


function App() {
 
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<AboutUs/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/share' element={<ShareFood/>}/>

       <Route path='/find' element={<BrowseFood/>}/>
       <Route path="/food/:id" element={<FoodDetails />} /> 
       <Route path="/checkout/:id" element={<Checkout />} />

      
    </Routes>
    </BrowserRouter>
  )
}

export default App
