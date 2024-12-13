import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaHeart } from "react-icons/fa";
import { GoCommentDiscussion } from "react-icons/go";
import { Modal } from 'antd';
import { IoSend } from "react-icons/io5";

// Import Swiper styles
import 'swiper/css';
import { toast } from 'react-toastify';

const Home = () => {
  const userStore = useSelector((state) => state.user);
  const [AllPosts, setAllPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState("");
  const [commentValues, setCommentValues] = useState({});

  const getAllUserPost = async () => {
    try {
      const res = await axios.get('https://pixify-backend-phx3.onrender.com/post/getAllpost');
      setAllPosts(res.data.post);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    getAllUserPost();
  }, []);

  const handleLikes = async (postId) => {
    try {
      await axios.get(`https://pixify-backend-phx3.onrender.com/post/like/${postId}`, {
        headers: {
          'Authorization': userStore.token,
        },
      });
      getAllUserPost();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const commentClicked = (obj) => {
    setSelectedPost(obj);
    setIsModalOpen(true);
  };

  const handleCommentChange = (e, postId) => {
    setCommentValues((prev) => ({
      ...prev,
      [postId]: e.target.value,
    }));
  };

  const handleCommentSubmit = async (postId) => {
    const commentValue = commentValues[postId];
    if (!commentValue || !commentValue.trim()) {
      toast.error("Comment cannot be empty", { position: "bottom-right", theme: 'dark' });
      return;
    }
    try {
      const res = await axios.post(
        `https://pixify-backend-phx3.onrender.com/post/comment/${postId}`,
        { text: commentValue },
        {
          headers: {
            'Authorization': userStore.token,
          },
        }
      );
      if (res.data.success) {
        // toast.success('Comment added successfully', { position: "top-center", theme: 'dark' });
        alert('Comment added successfully')
        getAllUserPost();
        setCommentValues((prev) => ({
          ...prev,
          [postId]: '',
        }));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(120deg, #c6ffdd 0%, #fbd786 100%)' }}>
      <header className="sticky top-0 bg-white shadow-md z-50 py-4 px-4 ">
        <h1 className="text-3xl font-serif font-semibold text-blue-800">
          My Social App
        </h1>
      </header>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[25%] fixed z-50  p-4">
          <Sidebar getAllUserPost={getAllUserPost} />
        </div>
        <section className="flex-1 flex justify-center px-4">
          <div className="max-w-2xl w-full space-y-6">
            { AllPosts?     AllPosts.map((ele) => (
              <div
                key={ele._id}
                className="rounded-lg shadow-lg bg-white border border-gray-200"
              >
                {/* User Info */}
                <div className="p-4 flex items-center bg-gradient-to-r from-blue-50 to-blue-100">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-blue-300"
                    src={ele.userId.profilePic}
                    alt="Profile"
                  />
                  <div className="ml-4">
                    <p className="text-base font-medium text-gray-800">{ele.userId.name}</p>
                    <p className="text-sm text-gray-600">
                      {formatDistanceToNow(new Date(ele.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {/* Post Media */}
                <Swiper spaceBetween={0} slidesPerView={1}>
                  {ele.file.map((data) => (
                    <SwiperSlide key={data.url}>
                      {data.resource_type === 'image' ? (
                        <img className="w-full h-96 object-contain" src={data.url} alt="" />
                      ) : (
                        <video className="w-full h-96 object-contain" controls src={data.url}></video>
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>
                {/* Post Info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaHeart
                        onClick={() => handleLikes(ele._id)}
                        className={`cursor-pointer ${
                          ele.likes.includes(userStore.user._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                        }`}
                        size={24}
                      />
                      <GoCommentDiscussion
                        onClick={() => commentClicked(ele)}
                        className="cursor-pointer text-gray-400 hover:text-blue-500"
                        size={24}
                      />
                    </div>
                    <p className="text-sm text-gray-500">{ele.likes.length} likes</p>
                  </div>
                  <h2 className="text-lg font-serif text-gray-800">{ele.title}</h2>
                  <p className="text-sm text-gray-600">{ele.description}</p>
                </div>
                {/* Comment Section */}
                <div className="p-4 bg-gray-50 border-t">
                  <div className="flex items-center">
                    <img
                      className="w-8 h-8 rounded-full border border-blue-200"
                      src={userStore.user.profilePic}
                      alt="Profile"
                    />
                    <input
                      value={commentValues[ele._id] || ''}
                      onChange={(e) => handleCommentChange(e, ele._id)}
                      type="text"
                      className="ml-3 flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      placeholder="Add a comment..."
                    />
                    <button
                      onClick={() => handleCommentSubmit(ele._id)}
                      className="ml-3 text-blue-600 hover:text-blue-800"
                    >
                      <IoSend size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )):
            <h1 className='text-6xl font-bold text-center'>No Posts Yet</h1>
            }
          </div>
        </section>
      </div>
      <Modal title="Comments" open={isModalOpen} onOk={handleModalOk} onCancel={handleModalCancel}>
        <div>
          {selectedPost?.comments?.length > 0 ? (
            selectedPost.comments.map((obj) => (
              <div key={obj._id} className="mb-2 p-2 border-b">
                <div className="flex items-center">
                  <img src={obj.user.profilePic} alt="User" className="w-6 h-6 rounded-full" />
                  <span className="ml-2 text-sm font-semibold">{obj.user.name}</span>
                </div>
                <p className="ml-8 text-sm">{obj.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No comments yet</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Home;
