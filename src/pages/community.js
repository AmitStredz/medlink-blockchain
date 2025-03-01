import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiDislike, BiLike } from "react-icons/bi";
import { FaRegComment, FaUserMd, FaUserInjured } from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import CommentModal from "../components/commentModal";
import CreatePostModal from "../components/createPostModal";

export default function Community({ triggerFetch }) {
  const [data, setData] = useState([]);
  const [commentModalData, setCommentModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchData = async () => {
    const key = localStorage.getItem("key");
    if (!key) {
      alert("Key not found...");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://medlink-zavgk.ondigitalocean.app/api/posts/",
        {
          Headers: {
            Authentication: `Token ${key}`,
          },
        }
      );
      if (response) {
        setData(response.data);
      }
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCommentClick = (data) => {
    setCommentModalData(data);
    setOpenCommentModal(true);
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <MdHealthAndSafety className="text-4xl" />
            Medical Community Forum
          </h1>
          <p className="text-blue-100">Share experiences, ask questions, and connect with healthcare professionals</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Action Bar */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors flex items-center gap-2"
            onClick={() => setOpenCreatePostModal(true)}
          >
            <span className="text-xl">+</span>
            Create Discussion
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full ${
                filter === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } transition-colors`}
            >
              All Posts
            </button>
            <button
              onClick={() => setFilter('doctors')}
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                filter === 'doctors' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } transition-colors`}
            >
              <FaUserMd />
              From Doctors
            </button>
            <button
              onClick={() => setFilter('patients')}
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                filter === 'patients' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } transition-colors`}
            >
              <FaUserInjured />
              From Patients
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((post, index) => (
              <div
                key={index}
                onClick={() => handleCommentClick(post)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  {/* Author Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        {post.userType === 'doctor' ? (
                          <FaUserMd className="text-blue-500" />
                        ) : (
                          <FaUserInjured className="text-blue-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{post.author}</h3>
                        <p className="text-sm text-gray-500">{getTimeAgo(post.date)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h2 className="text-xl font-semibold mb-3 text-gray-900">{post.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.desc}</p>

                  {/* Interaction Bar */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-4 text-gray-500">
                      <span className="flex items-center gap-1 hover:text-blue-500">
                        <BiLike /> {post.likes || 0}
                      </span>
                      <span className="flex items-center gap-1 hover:text-blue-500">
                        <BiDislike /> {post.dislikes || 0}
                      </span>
                      <span className="flex items-center gap-1 hover:text-blue-500">
                        <FaRegComment /> {post.comments?.length || 0}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <MdHealthAndSafety className="text-5xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No discussions yet. Be the first to start one!</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {openCommentModal && (
        <CommentModal
          fetchData={fetchData}
          data={commentModalData}
          onClose={() => setOpenCommentModal(false)}
        />
      )}
      {openCreatePostModal && (
        <CreatePostModal
          fetchData={fetchData}
          onClose={() => setOpenCreatePostModal(false)}
        />
      )}
    </div>
  );
}
