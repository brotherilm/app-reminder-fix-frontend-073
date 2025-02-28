import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit2, X, Plus, Save } from "lucide-react";

interface AirdropData {
  airdropId: string;
  name?: string;
  timer?: string;
  attempt?: string;
  rating?: number;
  totalSpend?: string;
  note?: string;
}

interface NoteCardProps {
  isOpen: boolean;
  onClose: () => void;
  airdropId: string | null;
}

const Note: React.FC<NoteCardProps> = ({ isOpen, onClose, airdropId }) => {
  const [error, setError] = useState<string>("");
  const [airdropData, setAirdropData] = useState<AirdropData | null>(null);
  const [formData, setFormData] = useState({
    totalSpend: "",
    note: "",
  });
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    const fetchAirdropData = async () => {
      if (!isOpen || !airdropId) return;

      try {
        const token = localStorage.getItem("token");
        const userDataString = localStorage.getItem("user");

        if (!token || !userDataString) {
          throw new Error("Required data not found");
        }

        const userData = JSON.parse(userDataString);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}api/get-airdrop`,
          { _id: userData.userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const specificAirdrop = response.data.find(
          (item: AirdropData) => item.airdropId === airdropId
        );

        if (specificAirdrop) {
          setAirdropData(specificAirdrop);
          setFormData({
            totalSpend: specificAirdrop.totalSpend || "",
            note: specificAirdrop.note || "",
          });
        } else {
          setError("Airdrop data not found");
        }
      } catch (error) {
        setError("Failed to fetch airdrop data");
        console.error(error);
      }
    };

    fetchAirdropData();
  }, [isOpen, airdropId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const userDataString = localStorage.getItem("user");
      if (!token || !userDataString) throw new Error("Required data not found");

      const userData = JSON.parse(userDataString);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/edit-note`,
        {
          _id: userData.userId,
          airdropId: airdropId,
          totalSpend: formData.totalSpend,
          note: formData.note,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setError(""); // Clear any existing errors
      setIsEditing(false); // Switch to view mode after saving
    } catch (error) {
      setError("Failed to update note");
      console.error(error);
    }
  };

  // Function to convert URLs in text to clickable links
  const renderTextWithLinks = (text: string) => {
    if (!text) return null;

    // Regex to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split text by URLs and create an array of text and link elements
    const parts = text.split(urlRegex);
    const matches = text.match(urlRegex) || [];

    return (
      <div className="whitespace-pre-wrap">
        {parts.map((part, index) => {
          // Check if this part matches a URL
          const isURL = matches.includes(part);

          if (isURL) {
            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {part}
              </a>
            );
          }

          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  if (!isOpen || !airdropData) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      {/* Error Toast */}
      {error && (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg">
          {error}
        </div>
      )}

      {/* Modal Container */}
      <div className="bg-black border-4 border-yellow-300 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="sticky top-0 bg-black z-10 px-6 py-4 border-b rounded-t-2xl border-yellow-300">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-yellow-300">
              More Information
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 border border-yellow-300 text-yellow-300 rounded-lg hover:bg-yellow-300 hover:text-black transition-colors"
              >
                {isEditing ? "View" : "Edit"}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-yellow-300 text-yellow-300 rounded-lg hover:bg-yellow-300 hover:text-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Airdrop Name */}
            <div>
              <h3 className="text-2xl font-semibold text-yellow-300 mb-6">
                {airdropData.name || "Unnamed Airdrop"}
              </h3>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-yellow-300">
                  Additional Note
                </label>
                {isEditing ? (
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 border-2 border-yellow-300/50 rounded-xl focus:border-yellow-300 focus:outline-none text-yellow-300 h-[500px] resize-none"
                  />
                ) : (
                  <div className="w-full px-4 py-2 bg-gray-800 border-2 border-yellow-300/50 rounded-xl text-yellow-300 h-[500px] overflow-y-auto">
                    {renderTextWithLinks(formData.note)}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            {isEditing && (
              <div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-yellow-300 text-black rounded-lg hover:bg-yellow-400 transition-colors font-medium"
                >
                  Submit
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Note;
