import React, { useState } from "react";
import { X } from "lucide-react";

interface FullNameCardProps {
  fullName: string;
  onClose: () => void;
}

const FullNameCard: React.FC<FullNameCardProps> = ({ fullName, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-black p-6 rounded-lg shadow-xl max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-white hover:text-gray-700"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold">{fullName}</h2>
      </div>
    </div>
  );
};

export const TruncatedName: React.FC<{ name: string; maxLength?: number }> = ({
  name,
  maxLength = 7,
}) => {
  const [showFullName, setShowFullName] = useState(false);

  const truncatedName =
    name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;

  return (
    <>
      <span
        className={`cursor-pointer ${
          name.length > maxLength
            ? "text-yellow-300 text-[20px] hover:underline underline"
            : "text-yellow-300 text-[20px] hover:underline underline"
        }`}
        onClick={() => name.length > maxLength && setShowFullName(true)}
      >
        {truncatedName}
      </span>

      {showFullName && (
        <FullNameCard fullName={name} onClose={() => setShowFullName(false)} />
      )}
    </>
  );
};

export default TruncatedName;
