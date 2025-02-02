import React, { useState, useEffect } from "react";
import axios from "axios";

interface Accordition {
  _id: string;
  accorditionLabel: string;
}

interface FormData {
  _id: string;
  name: string;
  hour: string;
  minutes: string;
  rating: string;
}

interface Props {
  onAirdropCreated: (newAirdrop: FormData) => void;
}

const Form: React.FC<Props> = ({ onAirdropCreated }) => {
  const [formData, setFormData] = useState<FormData>({
    _id: "",
    name: "",
    hour: "",
    minutes: "",
    rating: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  React.useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setFormData((prev) => ({
        ...prev,
        _id: userData.userId,
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      // Hitung timer dari hour dan minutes
      const timer = parseInt(formData.hour) * 60 + parseInt(formData.minutes);

      // Data yang akan dikirim ke API
      const dataToSend = {
        name: formData.name,
        timer: timer,
        rating: formData.rating,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/create-airdrop`,
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Call parent callback with new data
      onAirdropCreated(response.data);

      // Reset form
      setFormData((prev) => ({
        ...prev,
        name: "",
        hour: "",
        minutes: "",
        rating: "",
      }));

      setSuccess("Airdrop created successfully!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create airdrop");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border-4 border-yellow-300 rounded shadow-sm mb-10">
      <div className="text-2xl font-bold mb-4 text-center">
        Create New Airdrop
      </div>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-yellow-300 text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Timer (hour : minutes):
          </label>
          <div className="flex">
            <input
              type="number"
              name="hour"
              value={formData.hour}
              onChange={handleChange}
              className="mt-1 block w-1/2 p-2 mr-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-yellow-300 text-black"
              placeholder="HH"
              min="0"
              required
            />
            <input
              type="number"
              name="minutes"
              value={formData.minutes}
              onChange={handleChange}
              className="mt-1 block w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-yellow-300 text-black"
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
            required
            className="w-full px-4 py-2 bg-zinc-800 border-2 border-yellow-400/30 rounded-lg focus:border-yellow-400 focus:outline-none text-white"
          >
            <option value="" disabled>
              Choose Group
            </option>
            {accorditions.map((accordition, index) => (
              <option key={accordition._id} value={index + 1}>
                {accordition.accorditionLabel}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-yellow-300 hover:bg-yellow-400"
          } text-black py-2 px-4 rounded`}
        >
          {loading ? "Creating..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Form;
