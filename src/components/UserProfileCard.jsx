import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { FaHeart } from "react-icons/fa";
import { GoCommentDiscussion } from "react-icons/go";


const UserProfileCard = (props) => {
   let userStore=useSelector((state)=>state.user);
   let user=userStore.user;
   console.log(user)

   let [allPosts,setAllPost]=useState([]);
      console.log(allPosts)
     
      let likesLength=0;
      allPosts.forEach((post)=>{
        likesLength+=post.likes.length;
      })
      console.log(likesLength)

      props.getLikes(likesLength);

    let getUserPost=async()=>{
        let res=await axios.get(`https://pixify-backend-phx3.onrender.com/post/userPost/${user._id}`)
        let data=res.data;
        console.log(data);
        setAllPost(data.post);
    }
    const handleLike = async(postId)=>{
      console.log("running")
      console.log(postId)
      let res = await axios.get(`https://pixify-backend-phx3.onrender.com/post/like/${postId}`,{
        headers:{
          'Authorization':userStore.token
        }
      })
  
      let data = res.data;
      console.log(data)
      getUserPost()
    }
    useEffect(()=>{
        getUserPost();
    },[])
  return (
    <div className='w-[75%]'>
      
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
  </div>
  )
}

export default UserProfileCard