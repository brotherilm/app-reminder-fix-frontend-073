import React, { useState, useEffect } from "react";

interface AirdropCountdownProps {
  countdown: number;
  onExpire?: (isExpired: boolean) => void;
}

interface TimeLeft {
  hours: string | number;
  minutes: string | number;
  seconds: string | number;
  isExpired: boolean;
}

const AirdropCountdown: React.FC<AirdropCountdownProps> = ({
  countdown,
  onExpire,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: "00",
    minutes: "00",
    seconds: "00",
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = countdown - Date.now();

      if (difference <= 0) {
        if (onExpire) {
          onExpire(true);
        }
        return {
          hours: "00",
          minutes: "00",
          seconds: "00",
          isExpired: true,
        };
      }

      // Calculate time units
      const totalHours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return {
        hours: totalHours < 10 ? `0${totalHours}` : totalHours,
        minutes: minutes < 10 ? `0${minutes}` : minutes,
        seconds: seconds < 10 ? `0${seconds}` : seconds,
        isExpired: false,
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const intervalId = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.isExpired) {
        clearInterval(intervalId);
      }
    }, 1000);

    // Cleanup interval on unmount or when countdown changes
    return () => clearInterval(intervalId);
  }, [countdown, onExpire]);

  if (timeLeft.isExpired) {
    return (
      <div className="text-red-600 text-[15px] h-[20px] mb-4">
        {" "}
        {/* Tambahkan fixed height */}
        <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="text-white font-medium mb-4">
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};

export default AirdropCountdown;
