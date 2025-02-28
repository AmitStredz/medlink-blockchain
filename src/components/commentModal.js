import axios from "axios";
import React, { useState } from "react";
import { BiDislike, BiLike, BiRepost } from "react-icons/bi";
import { FaCheckCircle, FaRegComment, FaUserMd, FaUserCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdVerified } from "react-icons/md";

import adam from "../pages/assets/adam.png";

const CommentModal = ({ data, onClose, fetchData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [interactions, setInteractions] = useState({
    liked: false,
    disliked: false,
    likes: data.likes || 248,
    dislikes: data.dislikes || 23,
    comments: data.comments?.length || 0,
  });

  const handleInteraction = (type) => {
    setInteractions(prev => {
      if (type === 'like') {
        return {
          ...prev,
          liked: !prev.liked,
          disliked: false,
          likes: prev.liked ? prev.likes - 1 : prev.likes + 1,
          dislikes: prev.disliked ? prev.dislikes - 1 : prev.dislikes
        };
      } else if (type === 'dislike') {
        return {
          ...prev,
          disliked: !prev.disliked,
          liked: false,
          dislikes: prev.disliked ? prev.dislikes - 1 : prev.dislikes + 1,
          likes: prev.liked ? prev.likes - 1 : prev.likes
        };
      }
      return prev;
    });
  };

  const handleAddComment = async () => {
    if (isLoading || !comment.trim()) return;
    setIsLoading(true);

    const key = localStorage.getItem("key");
    if (!key) {
      alert("Authentication required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://medconnect-co7la.ondigitalocean.app/api/comment/",
        { id: data.id, comment: comment.trim() },
        { headers: { Authorization: `Token ${key}` } }
      );

      if (response?.data) {
        setSuccessModal(true);
        setTimeout(() => {
          setSuccessModal(false);
          onClose();
        }, 2000);
        fetchData();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successModal) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center animate-fade-in">
          <FaCheckCircle size={60} className="text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Comment Posted Successfully!
          </h3>
          <p className="text-gray-500">Your comment has been added to the discussion.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Discussion Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose size={24} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-12rem)]">
          <div className="p-6 space-y-6">
            {/* Post Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  {data.userType === 'doctor' ? (
                    <FaUserMd className="text-blue-500 text-xl" />
                  ) : (
                    <FaUserCircle className="text-blue-500 text-xl" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{data.author}</h3>
                    {data.userType === 'doctor' && (
                      <MdVerified className="text-blue-500" />
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{new Date(data.date).toLocaleDateString()}</p>
                </div>
              </div>

              <h1 className="text-xl font-semibold text-gray-800">{data.title}</h1>
              <p className="text-gray-600">{data.desc}</p>

              {/* Tags */}
              {data.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Related Doctors */}
              {data.doctors_related?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Related Healthcare Professionals</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.doctors_related.map((doctor, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm"
                      >
                        <FaUserMd className="text-sm" />
                        @{doctor.username}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactions */}
              <div className="flex items-center gap-6 pt-4 border-t">
                <button
                  onClick={() => handleInteraction('like')}
                  className={`flex items-center gap-2 ${
                    interactions.liked ? 'text-blue-500' : 'text-gray-500'
                  } hover:text-blue-500 transition-colors`}
                >
                  <BiLike size={20} />
                  <span>{interactions.likes}</span>
                </button>
                <button
                  onClick={() => handleInteraction('dislike')}
                  className={`flex items-center gap-2 ${
                    interactions.disliked ? 'text-blue-500' : 'text-gray-500'
                  } hover:text-blue-500 transition-colors`}
                >
                  <BiDislike size={20} />
                  <span>{interactions.dislikes}</span>
                </button>
                <div className="flex items-center gap-2 text-gray-500">
                  <FaRegComment size={20} />
                  <span>{interactions.comments}</span>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Comments</h4>
              
              {/* Add Comment */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your comment..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  onClick={handleAddComment}
                  disabled={isLoading || !comment.trim()}
                  className={`px-4 py-2 rounded-lg ${
                    isLoading || !comment.trim()
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } transition-colors`}
                >
                  {isLoading ? 'Posting...' : 'Post'}
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {data.comments?.length > 0 ? (
                  data.comments.map((comment, index) => (
                    <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUserCircle className="text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-700">@{comment.author}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{comment.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No comments yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
