import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function LikeButton({ resourceType, id, initialLiked, onToggle }) {
  const [liked, setLiked] = useState(!!initialLiked);
  const token = localStorage.getItem("alumni_token");
  const normalType = {
    books: "book",
    book: "book",
    articles: "article",
    article: "article",
    videos: "video",
    video: "video",
    courses: "course",
    course: "course",
  }[resourceType] || resourceType;

  const toggle = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
    try {
      await axios.post(
        `/api/alumni/resource/${normalType}/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(newLiked ? "Saved to your likes" : "Removed from likes");
      if (onToggle) onToggle(newLiked);
    } catch (err) {
      setLiked((v) => !v);
      toast.error(err?.response?.data?.message || "Could not save like. Please try again.");
      console.error("Failed toggling like", err);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={liked}
      className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${
        liked ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-700"
      }`}
    >
      {liked ? "Liked" : "Like"}
    </button>
  );
}
