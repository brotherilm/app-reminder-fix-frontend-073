import React from "react";
import axios from "axios";

const calculateTime = (): number => {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();

  // Waktu referensi jam 07:00 WIB (dalam waktu lokal)
  const referenceHour = 7;
  const referenceMinute = 0;

  // Menghitung selisih waktu dalam menit
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const referenceTimeInMinutes = referenceHour * 60 + referenceMinute;

  let timeDifferenceInMinutes: number;

  // Jika waktu sekarang sudah lewat jam 07:00
  if (currentTimeInMinutes >= referenceTimeInMinutes) {
    // X = 24 jam - (waktu sekarang - 07:00)
    timeDifferenceInMinutes =
      1440 - (currentTimeInMinutes - referenceTimeInMinutes);
  } else {
    // X = (07:00 - waktu sekarang)
    timeDifferenceInMinutes = referenceTimeInMinutes - currentTimeInMinutes;
  }

  // Mengonversi waktu perbedaan dalam menit menjadi detik
  return timeDifferenceInMinutes * 60;
};

const GlobalTime: React.FC = () => {
  const handleResetTimer = async () => {
    const token = localStorage.getItem("token");
    const userDataString = localStorage.getItem("user");

    if (!token || !userDataString) {
      throw new Error("Authentication token or user data not found");
    }

    const userData = JSON.parse(userDataString);
    const calculatedTime = calculateTime();

    const requestBody = {
      _id: userData.userId,
      time: calculatedTime.toString(),
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/time`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      // Reload the web page after successful API response
      window.location.reload();
    } catch (error) {
      console.error("Failed to call API:", error);
    }
  };

  return (
    <button
      onClick={handleResetTimer}
      className="p-2 bg-yellow-300 text-white rounded-lg hover:bg-yellow-400 fixed top-20 left-20 right-20 bottom-20 z-50 flex justify-center items-center"
    >
      Reset Timer
    </button>
  );
};

export default GlobalTime;
