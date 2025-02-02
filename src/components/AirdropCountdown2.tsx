import React, { useState, useEffect, useMemo } from "react";

interface AirdropCountdownProps {
  countdown: number;
  onExpire?: (isExpired: boolean) => void;
}

const AirdropCountdown: React.FC<AirdropCountdownProps> = ({
  countdown,
  onExpire,
}) => {
  const calculateTimeRemaining = useMemo(() => {
    return (difference: number) => {
      if (difference > 0) {
        const totalHours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return {
          hours: totalHours < 10 ? `0${totalHours}` : totalHours,
          minutes: minutes < 10 ? `0${minutes}` : minutes,
          seconds: seconds < 10 ? `0${seconds}` : seconds,
          total: difference,
          isExpired: false,
        };
      }

      return {
        hours: "00",
        minutes: "00",
        seconds: "00",
        total: 0,
        isExpired: true,
      };
    };
  }, []);

  const [timeLeft, setTimeLeft] = useState(() => {
    const difference = countdown - Date.now();
    return calculateTimeRemaining(difference);
  });

  useEffect(() => {
    // Check if countdown is in the future
    if (countdown > Date.now()) {
      const timer = setInterval(() => {
        const difference = countdown - Date.now();
        const newTimeLeft = calculateTimeRemaining(difference);

        setTimeLeft(newTimeLeft);

        // Call onExpire callback and stop timer when countdown reaches zero
        if (difference <= 0) {
          clearInterval(timer);

          if (onExpire) {
            onExpire(true);
          }

          setTimeLeft({
            hours: "00",
            minutes: "00",
            seconds: "00",
            total: 0,
            isExpired: true,
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown, calculateTimeRemaining, onExpire]);

  // If timer has expired, render the green box
  if (timeLeft.isExpired) {
    return <div className="text-red-600 text-[15px] mb-4">EXPIRED</div>;
  }

  // Otherwise, render the countdown
  return (
    <div className="text-white font-medium mb-4">
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};

export default AirdropCountdown;
