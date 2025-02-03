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
  links?: Array<{
    label: string;
    url: string;
  }>;
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
    linkLabel: "",
    linkUrl: "",
  });
  const [links, setLinks] = useState<Array<{ label: string; url: string }>>([]);
  const [editingLink, setEditingLink] = useState<{
    index: number;
    label: string;
    url: string;
  } | null>(null);

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
            linkLabel: "",
            linkUrl: "",
          });
          setLinks(specificAirdrop.links || []);
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

  const handleAddLink = async () => {
    if (!formData.linkLabel || !formData.linkUrl) return;

    try {
      const token = localStorage.getItem("token");
      const userDataString = localStorage.getItem("user");
      if (!token || !userDataString) throw new Error("Required data not found");

      const userData = JSON.parse(userDataString);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/add-link`,
        {
          _id: userData.userId,
          airdropId: airdropId,
          label: formData.linkLabel,
          url: formData.linkUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLinks((prevLinks) => [
        ...prevLinks,
        { label: formData.linkLabel, url: formData.linkUrl },
      ]);
      setFormData((prev) => ({
        ...prev,
        linkLabel: "",
        linkUrl: "",
      }));
    } catch (error) {
      setError("Failed to add link");
      console.error(error);
    }
  };

  const handleEditLink = (index: number) => {
    const link = links[index];
    setEditingLink({ index, label: link.label, url: link.url });
  };

  const handleUpdateLink = async () => {
    if (!editingLink) return;

    try {
      const token = localStorage.getItem("token");
      const userDataString = localStorage.getItem("user");
      if (!token || !userDataString) throw new Error("Required data not found");

      const userData = JSON.parse(userDataString);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/edit-link`,
        {
          _id: userData.userId,
          airdropId: airdropId,
          index: editingLink.index,
          label: editingLink.label,
          url: editingLink.url,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newLinks = [...links];
      newLinks[editingLink.index] = {
        label: editingLink.label,
        url: editingLink.url,
      };
      setLinks(newLinks);
      setEditingLink(null);
    } catch (error) {
      setError("Failed to update link");
      console.error(error);
    }
  };

  const handleDeleteLink = async (index: number) => {
    try {
      const token = localStorage.getItem("token");
      const userDataString = localStorage.getItem("user");
      if (!token || !userDataString) throw new Error("Required data not found");

      const userData = JSON.parse(userDataString);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/delete-link`,
        {
          _id: userData.userId,
          airdropId: airdropId,
          index: index,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
    } catch (error) {
      setError("Failed to delete link");
      console.error(error);
    }
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
      onClose(); // Close the modal after successful submission
    } catch (error) {
      setError("Failed to update note");
      console.error(error);
    }
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
            <button
              onClick={onClose}
              className="px-4 py-2 border border-yellow-300 text-yellow-300 rounded-lg hover:bg-yellow-300 hover:text-black transition-colors"
            >
              Close
            </button>
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
                  Total Spend
                </label>
                <input
                  type="text"
                  name="totalSpend"
                  value={formData.totalSpend}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border-2 border-yellow-300/50 rounded-xl focus:border-yellow-300 focus:outline-none text-yellow-300"
                />
              </div>

              <div>
                <label className="block mb-2 text-yellow-300">
                  Additional Note
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border-2 border-yellow-300/50 rounded-xl focus:border-yellow-300 focus:outline-none text-yellow-300 h-32 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="px-6 py-2 bg-yellow-300 text-black rounded-lg hover:bg-yellow-400 transition-colors font-medium"
              >
                Submit
              </button>
            </div>

            {/* Links Section */}
            <div className="space-y-4 pt-6 border-t border-yellow-300/30">
              <h3 className="text-xl font-semibold text-yellow-300">
                Additional Links
              </h3>

              {/* Add New Link */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-yellow-300">
                    Link Label
                  </label>
                  <input
                    type="text"
                    name="linkLabel"
                    value={formData.linkLabel}
                    onChange={handleInputChange}
                    maxLength={30}
                    className="w-full px-4 py-2 bg-gray-800 border-2 border-yellow-300/50 rounded-xl focus:border-yellow-300 focus:outline-none text-yellow-300"
                    placeholder="Enter button label"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-yellow-300">Link URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="linkUrl"
                      value={formData.linkUrl}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 bg-gray-800 border-2 border-yellow-300/50 rounded-xl focus:border-yellow-300 focus:outline-none text-yellow-300"
                      placeholder="Enter URL"
                    />
                    <button
                      type="button"
                      onClick={handleAddLink}
                      disabled={!formData.linkLabel || !formData.linkUrl}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        !formData.linkLabel || !formData.linkUrl
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-yellow-300 hover:bg-yellow-400 text-black"
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Links List */}
              {/* Links List */}
              <div className="space-y-3">
                {links.map((link, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-xl p-3">
                    {editingLink?.index === index ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingLink.label}
                          onChange={(e) =>
                            setEditingLink((prev) =>
                              prev ? { ...prev, label: e.target.value } : null
                            )
                          }
                          className="w-full px-4 py-2 bg-gray-700 border-2 border-yellow-300/50 rounded-xl focus:border-yellow-300 focus:outline-none text-yellow-300"
                          placeholder="Enter label"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingLink.url}
                            onChange={(e) =>
                              setEditingLink((prev) =>
                                prev ? { ...prev, url: e.target.value } : null
                              )
                            }
                            className="flex-1 px-4 py-2 bg-gray-700 border-2 border-yellow-300/50 rounded-xl focus:border-yellow-300 focus:outline-none text-yellow-300"
                            placeholder="Enter URL"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleUpdateLink();
                            }}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setEditingLink(null);
                            }}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-yellow-300 truncate hover:text-yellow-400  w-[75%]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">{link.label}</div>
                          </div>
                        </a>
                        <div className="flex gap-2 shrink-0 border border-yellow-300 w-[25%] justify-around">
                          <button
                            type="button"
                            onClick={() => handleEditLink(index)}
                            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLink(index)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Note;
