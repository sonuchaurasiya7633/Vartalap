import React, { useEffect } from 'react'
import SignUp from './Pages/SignUp'
import { createBrowserRouter, data, Navigate, RouterProvider } from 'react-router-dom'
import Login from './Pages/Login'
import Home from './Pages/Home'
import { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import io from "socket.io-client";
import { setAllOnlineUsers, setSocket } from './redux/slices/socket'


const App = () => {

  const {token} = useSelector((state)=> state.auth);
  const {userData} = useSelector((state)=> state.user);
  const dispatch = useDispatch();


  

  const router = createBrowserRouter([
    {
      path:"/",
      element: token ? <Home/> : <SignUp/>    
    },
    {
      path:"/login",
      element:token ? <Home/> : <Login/>
    },
    {
      path:"/home",
      element: token ? <Home/> : <Navigate to={"/login"}/>
      
    }
  ]);

  useEffect(()=>{

    if(!token || !userData?._id){
      return ;
    }

    const socket = io(`${import.meta.env.VITE_SOCKET_URL}`,{
      query:{
        userId:userData?._id,
      }
    });

    dispatch(setSocket(socket));

    socket.on("send-all-online-users",(data)=>{
      dispatch(setAllOnlineUsers(data));
    })

    return ()=>{
      socket.off("send-all-online-users");
      socket.disconnect();
    }


  },[token]);

  return (
    <div className='min-h-screen w-screen bg-gray-950 
    flex items-center justify-center text-white' >
      
     <RouterProvider router={router}>

     </RouterProvider>
     <Toaster/>
    
    </div>
  )
}

export default App