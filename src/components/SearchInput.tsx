import React, { useState } from "react";

interface AirdropItem {
  rating: number;
  support: number;
  name?: string;
  description?: string;
  // Add other properties as needed
}

interface SearchInputProps {
  airdropData: AirdropItem[];
  setFilteredAirdropData: React.Dispatch<React.SetStateAction<AirdropItem[]>>;
}

const SearchInput: React.FC<SearchInputProps> = ({
  airdropData,
  setFilteredAirdropData,
}) => {
  const [query, setQuery] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setQuery(searchValue);

    // Filter airdrop data based on search query
    const filtered = airdropData.filter(
      (item) =>
        // Search across multiple fields, adjust as needed
        item.name?.toLowerCase().includes(searchValue) ||
        item.description?.toLowerCase().includes(searchValue)
    );

    setFilteredAirdropData(filtered);
  };

  return (
    <div className="w-full  text-black ">
      <div className="m-4 ">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search airdrops..."
          className="w-full px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-yellow-300"
        />
      </div>
    </div>
  );
};

export default SearchInput;
