import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { FaCameraRetro, FaHeart } from "react-icons/fa";
import UserProfileCard from '../components/UserProfileCard';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { GoCommentDiscussion } from "react-icons/go";
import { toast } from 'react-toastify';

const FriendProfile = (props) => {
   
  let token=useSelector((state)=>state.user.token)
  console.log(token)

  let userStore=useSelector((state)=>state.user)
  let original=userStore.user
  console.log(original)

  
   let location=useLocation();
   let userId=location.state;
   console.log(userId)
  

   const [userDetails,setUserDetails]=useState('')
   async function getUserDetails(){
    let res=await axios.get(`https://pixify-backend-phx3.onrender.com/user/getSingleUser/${userId}`);
    let data=res.data;
    console.log(data)
    setUserDetails(data.user)
   }

   useEffect(()=>{
     getUserDetails()
   },[userId])
   

   const handleFollow=async()=>{
    let res=await axios.get(`https://pixify-backend-phx3.onrender.com/user/follow/${userId}`,{
      headers:{
        'Authorization':token
      }
    })
    console.log(res.data)
    if(res.data.success){
      toast.success('User followed successfully')
      props.getUserDetails()
    }
    else{
      toast.warning('User Unfollowed successfully')
      props.getUserDetails()
    }
   }
   let [allPosts,setAllPost]=useState([]);
   let getUserPost=async()=>{
    let res=await axios.get(`https://pixify-backend-phx3.onrender.com/post/userPost/${userId}`)
    let data=res.data;
    console.log(data);
    setAllPost(data.post);
}
useEffect(()=>{
  getUserPost();
},[userId])
   
  const [likesCount, setLikesCount] = useState();
  const getLikes=(ans)=>{
    console.log(ans)
    setLikesCount(ans)
  }
  
  return (
    <div className='w-full h-screen bg-gray-100'>


    <div className=" mx-auto mt-[64px] w-[100%] bg-white shadow-xl rounded-lg text-gray-900">
  <div className="rounded-t-lg h-32 overflow-hidden relative">
    <img className="object-cover object-top w-full" src={userDetails?.coverPic} alt="Cover Pic" />
  </div>
  <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
  <img
    className="object-cover object-center h-32"
    src={userDetails?.profilePic}
    alt="Profile Pic"
  />
  
</div>

  <div className="text-center mt-2">
    <h2 className="font-semibold">{userDetails?.name}</h2>
    <p className="text-gray-500">{userDetails.bio?userDetails.bio:"Enter a bio"}</p>
   {!original.following.includes(userId)  && <button onClick={handleFollow} className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white font-bold py-2 px-4 rounded shadow-lg hover:from-orange-500 hover:via-pink-600 hover:to-purple-700 transition duration-300 ease-in-out">
  Follow
</button>} 

{original.following.includes(userId) &&  <button onClick={handleFollow} class="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white font-bold py-2 px-4 rounded shadow-lg hover:from-red-500 hover:via-red-600 hover:to-red-700 transition duration-300 ease-in-out">
  Unfollow
</button>}

<Link to='/chat' state={{friend:userDetails}} className='bg-blue-950 mx-2 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-blue-800 transition duration-300 ease-in-out' >Chat</Link>

  </div>
  <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
    <li className="flex flex-col items-center justify-around">
      {/* <svg className="w-4 fill-current text-blue-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg> */}
      <p className="font-bold">Followings</p>
      <div>{userDetails.following?.length}</div>
    </li>
    <li className="flex flex-col items-center justify-between">
      {/* <svg className="w-4 fill-current text-blue-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c2.15 0 4.2.4 6.1 1.09L12 16h-1.25L10 20H4l-.75-4H2L.9 10.09A17.93 17.93 0 0 1 7 9zm8.31.17c1.32.18 2.59.48 3.8.92L18 16h-1.25L16 20h-3.96l.37-2h1.25l1.65-8.83zM13 0a4 4 0 1 1-1.33 7.76 5.96 5.96 0 0 0 0-7.52C12.1.1 12.53 0 13 0z" />
      </svg> */}
      <p className="font-bold">Followers</p>
      <div>{userDetails?.followers?.length}</div>
    </li>
    <li className="flex flex-col items-center justify-around">
      {/* <svg className="w-4 fill-current text-blue-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z" />
      </svg> */}
      <FaHeart size={25} color='red' />
      <div>{likesCount}</div>
    </li>
  </ul>
</div>

 {/* form */}
<div>
<div className="flex justify-center gap-4 mt-3">
  
  {/* <UserProfileCard  getLikes={getLikes}/> */}
  
    {allPosts.length>0 ? <div className='w-[75%]'>
      
      {
        allPosts.map((ele)=>{
            return <article className="relative flex bg-white transition hover:shadow-xl mb-4">
  
                <div className='absolute right-4 top-4'>
                   <span className='flex'> <FaHeart color={ele.likes.includes(userStore.user._id)?'red':''} onClick={()=>handleLike(ele._id)} size={25}/> <sup>{ele.likes.length}</sup></span>
                    <span className='flex mt-6'><GoCommentDiscussion size={25} /> <sub>{ele.comments.length}</sub></span>
                </div>
            {/* <div className="rotate-180 p-2 [writing-mode:_vertical-lr]">
              <time
                datetime="2022-10-10"
                className="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
              >
                <span>2022</span>
                <span className="w-px flex-1 bg-gray-900/10"></span>
                <span>Oct 10</span>
              </time>
            </div> */}
          
            <div className="hidden sm:block sm:basis-56">
              <img
                alt=""
                src={ele.file.map((ele)=>ele.url)}
                className="aspect-square h-full w-full object-cover"
              />
            </div>
          
            <div className="flex flex-1 flex-col justify-between">
              <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
                <a href="#">
                  <h3 className="font-bold uppercase text-gray-900">
                    {ele.title}
                  </h3>
                </a>
          
                <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
                 {ele.description}
                </p>
              </div>
            </div>
          </article>
        })
      }
    </div>: <h1 className='text-center mt-10 text-3xl'>No Post To Show Yet</h1>}

  
</div>


</div>

    
    </div>
  )
}

export default FriendProfile