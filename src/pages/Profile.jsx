import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { FaCameraRetro, FaHeart } from "react-icons/fa";
import UserProfileCard from '../components/UserProfileCard';
import { toast } from 'react-toastify';


const Profile = (props) => {
   
  let userStore=useSelector((state)=>state.user)
  let userDetails=userStore.user
  console.log(userDetails)

  const [details,setDetails]=useState({
    name:userDetails.name?userDetails.name:"",
    email:userDetails.email?userDetails.email:"",
    password:userDetails.password?userDetails.password:"",
    bio:userDetails.bio?userDetails.bio:"",
  })

  const handleInputChanger=(e)=>{
    let name=e.target.name;
    let value=e.target.value
    setDetails({...details,[name]:value})
  }

const handleSubmit=async(e)=>{
  e.preventDefault()
  console.log(details)
  let res=await fetch(`https://pixify-backend-phx3.onrender.com/user/update/${userDetails._id}`,{
    method:"PUT",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(details)
  })
  let data=await res.json()
  console.log(data)
  if(data.success==true){
    toast.success("Profile Updated Successfully")
    props.getUserDetails();
  }
}
   let handleCoverChanger=(e)=>{
    e.preventDefault()
    let file=e.target.files[0]
    let fileData=new FileReader()
    fileData.readAsDataURL(file)
    fileData.onload=async()=>{
      let res=await fetch(`https://pixify-backend-phx3.onrender.com/user/update/${userDetails._id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({coverPic:fileData.result})
      })
      let data=await res.json()
      console.log(data)
      if(data.success==true){
        toast.success("Cover Pic Updated Successfully")
        props.getUserDetails();
      }
     console.log(fileData.result)
    }
    fileData.onerror=()=>{
      console.log(fileData.error)
    }
   }

   let handleProfilePicChanger = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let fileData = new FileReader();
    fileData.readAsDataURL(file);
    fileData.onload = async () => {
      let res = await fetch(`https://pixify-backend-phx3.onrender.com/user/update/${userDetails._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profilePic: fileData.result }),
      });
      let data = await res.json();
      console.log(data);
      if (data.success === true) {
        toast.success("Profile Picture Updated Successfully");
        props.getUserDetails();
      }
    };
    fileData.onerror = () => {
      console.log(fileData.error);
    };
  };
  const [likesCount, setLikesCount] = useState();
  const getLikes=(ans)=>{
    console.log(ans)
    setLikesCount(ans)
  }
  
  return (
    <div className='w-full h-screen bg-gray-100'>


    <div className=" mx-auto mt-[64px] w-[100%] bg-white shadow-xl rounded-lg text-gray-900">
  <div className="rounded-t-lg h-32 overflow-hidden relative">
    <div className='absolute  right-8 bottom-6 cursor-pointer'>
      <label htmlFor="profile"><FaCameraRetro color='white' size={30} className='cursor-pointer' /></label>
      <input onChange={handleCoverChanger} type="file" id='profile' hidden/>
    </div>
    <img className="object-cover object-top w-full" src={userDetails?.coverPic} alt="Cover Pic" />
  </div>
  <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
  <img
    className="object-cover object-center h-32"
    src={userDetails?.profilePic}
    alt="Profile Pic"
  />
  <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer">
    <label htmlFor="profilePicUpload">
      <FaCameraRetro size={20} />
    </label>
    <input
      onChange={handleProfilePicChanger}
      type="file"
      id="profilePicUpload"
      hidden
    />
  </div>
</div>

  <div className="text-center mt-2">
    <h2 className="font-semibold">{userDetails.name}</h2>
    <p className="text-gray-500">{userDetails.bio?userDetails.bio:"Enter a bio"}</p>
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
      <div>{userDetails.followers?.length}</div>
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
<div className="flex gap-4 mt-3">
  <div className="bg-gray-400 h-min  ml-4 shadow-lg rounded-lg p-8 w-[400px] space-y-6">
    <h2 className="text-2xl font-bold text-gray-800 text-center">Update Details</h2>
    <div className="space-y-4">
      <div>
        <label
          className="block text-sm font-medium text-gray-600"
          htmlFor="username"
        >
          User Name
        </label>
        <input onChange={handleInputChanger} name='name'
        value={details.name}
          className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
          type="text"
          placeholder="Enter User Name"
          id="username"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-600"
          htmlFor="email"
        >
          Email
        </label>
        <input disabled
        value={details.email}
          className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
          type="email"
          placeholder="Enter Email"
          id="email"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-600"
          htmlFor="bio"
        >
          Bio
        </label>
        <input onChange={handleInputChanger} name='bio'
        value={details.bio}
          className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
          type="text"
          placeholder="Enter Bio"
          id="bio"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-600"
          htmlFor="password"
        >
          Password
        </label>
        <input onChange={handleInputChanger} name='password'
        value={details.password}
          className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
          type="password"
          placeholder="Enter Password"
          id="password"
        />
      </div>
    </div>
    <button onClick={handleSubmit} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md transition">
      Update Details
    </button>
  </div>
  <UserProfileCard getLikes={getLikes}/>
</div>


</div>

    
    </div>
  )
}

export default Profile