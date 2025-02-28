import axios from "axios";
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdHealthAndSafety } from "react-icons/md";

const CreatePostModal = ({ onClose, fetchData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const handleCreatePost = async () => {
    if (isLoading || !title.trim() || !description.trim()) return;
    setIsLoading(true);

    const key = localStorage.getItem("key");
    if (!key) {
      alert("Authentication required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://medconnect-co7la.ondigitalocean.app/api/posts/",
        {
          title: title.trim(),
          desc: description.trim(),
        },
        {
          headers: {
            Authorization: `Token ${key}`,
          },
        }
      );

      if (response?.data) {
        setSuccessModal(true);
        fetchData();
        setTimeout(() => {
          setSuccessModal(false);
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      {!successModal ? (
        <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full transform transition-all animate-fade-in">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MdHealthAndSafety className="text-3xl text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Create Discussion</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoClose size={24} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  placeholder="What's your discussion about?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  maxLength={100}
                />
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {title.length}/100
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Share your thoughts, experiences, or questions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  maxLength={500}
                />
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {description.length}/500
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={isLoading || !title.trim() || !description.trim()}
                className={`px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium 
                  ${isLoading || !title.trim() || !description.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-blue-600 hover:to-blue-700'
                  } transition-all`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Posting...
                  </div>
                ) : (
                  'Post Discussion'
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center animate-fade-in">
          <FaCheckCircle size={60} className="text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Posted Successfully!
          </h3>
          <p className="text-gray-500">
            Your discussion has been shared with the community.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreatePostModal;
