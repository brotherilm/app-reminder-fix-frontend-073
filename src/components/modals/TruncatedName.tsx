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
        <h2 className="text-xl font-bold break-words">{fullName}</h2>
      </div>
    </div>
  );
};

export const TruncatedName: React.FC<{ name: string; maxLength?: number }> = ({
  name,
  maxLength = 10,
}) => {
  const [showFullName, setShowFullName] = useState(false);

  const truncatedName =
    name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;

  return (
    <div className="inline-block max-w-full">
      <span
        className={`inline-block truncate max-w-full ${
          name.length > maxLength
            ? "text-yellow-300 text-[20px] hover:underline"
            : "text-yellow-300 text-[20px] hover:underline"
        }`}
        onClick={() => name.length > maxLength && setShowFullName(true)}
      >
        {truncatedName}
      </span>

      {showFullName && (
        <FullNameCard fullName={name} onClose={() => setShowFullName(false)} />
      )}
    </div>
  );
};

export default TruncatedName;
