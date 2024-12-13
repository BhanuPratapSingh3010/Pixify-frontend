import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { updateUser } from './store/UserSlice'
import Navbar from './components/Navbar'
import ForgetPassword from './pages/ForgetPassword'
import Profile from './pages/Profile'
import FriendProfile from './pages/FriendProfile'
import Chat from './pages/Chat'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {

  let dispatch=useDispatch()
  let userStore=useSelector((state)=>state.user)
  console.log(userStore)
   let login=userStore.login
  const getUserDetails=async()=>{
    let res=await axios.get('https://pixify-backend-phx3.onrender.com/user/getUser',{
      headers:{
        'Authorization':userStore.token
    }
  })
  let data=res.data
  console.log(data)
  dispatch(updateUser(data))
  }
   
  useEffect(()=>{
    if(userStore.token){
      getUserDetails()
    }
  },[userStore.token])

  return (
    <div>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={login===true?<Home/>:<Navigate to={'/login'}/>} />
          <Route path='/login' element={login===false?<Login/>:<Navigate to={'/'}/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/forget-password' element={<ForgetPassword/>} />
        <Route path='/profile' element={login===true?<Profile getUserDetails={getUserDetails}/>:<Navigate to={'/login'}/>} />
        <Route path='friendProfile' element={login===true?<FriendProfile getUserDetails={getUserDetails}/>:<Navigate to={'/login'}/>} />
        <Route path='chat' element={login===true?<Chat getUserDetails={getUserDetails}/>:<Navigate to={'/login'}/>}/>
        </Routes>
      </Router>

      <ToastContainer
position="top-center"
autoClose={2000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition:Bounce/>
    </div>
  )
}

export default App