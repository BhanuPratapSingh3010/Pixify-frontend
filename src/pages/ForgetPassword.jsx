import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://pixify-backend-phx3.onrender.com/user/resetPassword', { email });
      if (response.data.success) {
        toast.success('Password reset link sent to your email.');
        console.log(response.data);
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to send password reset link.'
      );
    }
  };

  return (
   <div className='w-full h-screen flex justify-center items-center'>
     <div className="w-full h-full flex justify-center items-center">
      <div className="max-w-md w-full p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Send Reset Link
          </button>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
   </div>
  );
};

export default ForgetPassword;
