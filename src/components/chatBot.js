import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPaperPlane, FaUserMd } from 'react-icons/fa';
import { BsPersonCircle } from 'react-icons/bs';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function ChatComponent({ id, name }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const savedMessages = localStorage.getItem(`chat_messages_${id}`);
      setMessages(savedMessages ? JSON.parse(savedMessages) : []);
    } else {
      setMessages([]);
    }
  }, [id]);

  useEffect(() => {
    if (id && messages.length > 0) {
      localStorage.setItem(`chat_messages_${id}`, JSON.stringify(messages));
    }
  }, [messages, id]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const now = new Date();
    const userMessage = { text: input, type: "sent", timestamp: now };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://medconnect-co7la.ondigitalocean.app/api/chat/",
        { patient_id: id, prompt: input }
      );

      const formattedResponse = response?.data?.response
        ?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        ?.replace(/\\n/g, '\n');

      setMessages(prev => [...prev, {
        text: formattedResponse,
        type: "received",
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "Sorry, I couldn't process your request. Please try again.",
        type: "error",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChatHistory = () => {
    if (id) {
      localStorage.removeItem(`chat_messages_${id}`);
      setMessages([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col bg-white shadow-lg rounded-xl h-[40rem] border-2 border-blue-100">
      {/* Header */}
      <div className="rounded-t-xl bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaUserMd className="text-2xl" />
            {name ? (
              <div>
                <h2 className="font-semibold text-lg">Medical Assistant</h2>
                <p className="text-sm opacity-90">Consulting about {name}</p>
              </div>
            ) : (
              <p className="text-lg font-medium">Please select a patient to begin consultation</p>
            )}
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChatHistory}
              className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition-colors"
            >
              Clear History
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-auto bg-gray-50">
        <div className="space-y-4 w-full">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full ${
                msg.type === "sent" ? "justify-end" : "justify-start"
              } gap-2`}
            >
              {msg.type !== "sent" && (
                <FaUserMd className="text-blue-500 text-xl self-end" />
              )}
              <div className={`max-w-[80%] flex flex-col ${
                msg.type === "sent" ? "items-end" : "items-start"
              }`}>
                <div
                  className={`p-3 rounded-2xl ${
                    msg.type === "sent"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : msg.type === "error"
                      ? "bg-red-100 text-red-600 rounded-bl-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <div
                    className="text-sm"
                    style={{ whiteSpace: "pre-line" }}
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }).format(new Date(msg.timestamp))}
                </span>
              </div>
              {msg.type === "sent" && (
                <BsPersonCircle className="text-blue-500 text-xl self-end" />
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-gray-500">
              <AiOutlineLoading3Quarters className="animate-spin" />
              <span>Processing your request...</span>
            </div>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            disabled={!name}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={name ? "Ask about patient's health..." : "Select a patient first..."}
            className="flex-1 p-3 rounded-full border-2 border-gray-200 focus:border-blue-500 outline-none transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!name || !input.trim()}
            className={`p-3 rounded-full transition-colors ${
              name && input.trim()
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}
