import React, { useState, useEffect } from "react";
import axios from "axios";

interface EditCardProps {
  isOpen: boolean;
  onClose: () => void;
  airdropId: string | null;
  onUpdate: () => void;
}

interface AirdropFormData {
  _id: string;
  airdropId: string;
  name: string;
  hour: string;
  minutes: string;
  rating: string;
  LinkTelegramPlay?: string;
  LinkWebPlay?: string;
  LinkTelegramChannel?: string;
  LinkWebAnnountcement?: string;
  LinkX?: string;
}

interface Accordition {
  _id: string;
  accorditionLabel: string;
}

const EditCard: React.FC<EditCardProps> = ({
  isOpen,
  onClose,
  airdropId,
  onUpdate,
}) => {
  const [error, setError] = useState<string>("");
  const [airdropData, setAirdropData] = useState<any | null>(null);
  const [formData, setFormData] = useState<AirdropFormData>({
    _id: "",
    airdropId: "",
    name: "",
    hour: "",
    minutes: "",
    rating: "",
    LinkTelegramPlay: "",
    LinkWebPlay: "",
    LinkTelegramChannel: "",
    LinkWebAnnountcement: "",
    LinkX: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accorditions, setAccorditions] = useState<Accordition[]>([]);

  useEffect(() => {
    const fetchAccorditions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}api/get-accordition`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setAccorditions(response.data.accorditions);
        }
      } catch (error) {
        console.error("Failed to fetch accorditions:", error);
      }
    };

    fetchAccorditions();
  }, []);

  useEffect(() => {
    const fetchAirdropData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userDataString = localStorage.getItem("user");

        if (!token || !userDataString || !airdropId) {
          throw new Error("Required data not found");
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}api/get-airdrop`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const specificAirdrop = response.data.find(
          (item: any) => item.airdropId === airdropId
        );
        setAirdropData(specificAirdrop);

        if (specificAirdrop) {
          const userData = JSON.parse(userDataString);
          setFormData({
            _id: userData.userId, // Set user ID from localStorage
            airdropId: specificAirdrop.airdropId,
            name: specificAirdrop.name || "",
            hour: Math.floor(specificAirdrop.timer / 60).toString(), // Convert timer to hour
            minutes: (specificAirdrop.timer % 60).toString(), // Convert timer to minutes
            rating: specificAirdrop.rating || "",
            LinkTelegramPlay: specificAirdrop.LinkTelegramPlay || "",
            LinkWebPlay: specificAirdrop.LinkWebPlay || "",
            LinkTelegramChannel: specificAirdrop.LinkTelegramChannel || "",
            LinkWebAnnountcement: specificAirdrop.LinkWebAnnountcement || "",
            LinkX: specificAirdrop.LinkX || "",
          });
        }
      } catch (error) {
        setError("Failed to fetch airdrop data");
        console.error(error);
      }
    };

    if (isOpen && airdropId) {
      fetchAirdropData();
    }
  }, [isOpen, airdropId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      // Hitung timer dari hour dan minutes
      const timer = parseInt(formData.hour) * 60 + parseInt(formData.minutes);

      // Data yang akan dikirim ke API
      const dataToSend = {
        ...formData,
        timer: timer,
      };

      if (
        !dataToSend.airdropId ||
        !dataToSend.name ||
        !dataToSend.timer ||
        !dataToSend.rating
      ) {
        throw new Error("Please fill in all required fields");
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/edit-airdrop`,
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onUpdate(); // Call the update function
      onClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update airdrop"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !airdropData) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      {error && (
        <div className="absolute top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      <div className="bg-zinc-900 border-2 border-yellow-400 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-yellow-400/30">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-yellow-400">
              Edit Airdrop
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-zinc-800 border-2 border-yellow-400/30 rounded-lg focus:border-yellow-400 focus:outline-none text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-1">
                  Timer *
                </label>
                <div className="flex">
                  <input
                    type="number"
                    name="hour"
                    value={formData.hour}
                    onChange={handleInputChange}
                    className="w-1/2 px-4 py-2 bg-zinc-800 border-2 border-yellow-400/30 rounded-lg focus:border-yellow-400 focus:outline-none text-white mr-2"
                    placeholder="HH"
                    min="0"
                    required
                  />
                  <input
                    type="number"
                    name="minutes"
                    value={formData.minutes}
                    onChange={handleInputChange}
                    className="w-1/2 px-4 py-2 bg-zinc-800 border-2 border-yellow-400/30 rounded-lg focus:border-yellow-400 focus:outline-none text-white"
                    placeholder="MM"
                    min="0"
                    max="59"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-1">
                  Airdrop Rating
                </label>
                <select
                  name="rating"
                  value={formData.rating as string}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-zinc-800 border-2 border-yellow-400/30 rounded-lg focus:border-yellow-400 focus:outline-none text-white"
                >
                  {accorditions.map((accordition, index) => (
                    <option key={accordition._id} value={index + 1}>
                      {accordition.accorditionLabel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-1">
                    Telegram Link Play
                  </label>
                  <input
                    type="text"
                    name="LinkTelegramPlay"
                    value={formData.LinkTelegramPlay}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 border-2 border-yellow-400/30 rounded-lg focus:border-yellow-400 focus:outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-1">
                    Web Link Play
                  </label>
                  <input
                    type="text"
                    name="LinkWebPlay"
                    value={formData.LinkWebPlay}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 border-2 border-yellow-400/30 rounded-lg focus:border-yellow-400 focus:outline-none text-white"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-1">
                    Telegram Channel
                  </label>
                  <input
                    type="text"
                    name="LinkTelegramChannel"
                    value={formData.LinkTelegramChannel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 border-2 border-yellow-400/30 rounded-lg focus:border-yellow-400 focus:outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-1">
                    Web Announcement
                  </label>
                  <input
                    type="text"
                    name="LinkWebAnnountcement"
                    value={formData.LinkWebAnnountcement}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-zinc-800 border-2 border-yellow-400/30 rounded-lg focus:border-yellow-400 focus:outline-none text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-1">
                  X Link
                </label>
                <input
                  type="text"
                  name="LinkX"
                  value={formData.LinkX}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-zinc-800 border-2 border-yellow-400/30 rounded-lg focus:border-yellow-400 focus:outline-none text-white"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-yellow-400/30">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border-2 border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400/10"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCard;
