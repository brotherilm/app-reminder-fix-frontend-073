import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Note from "./note";
import EditCard from "./edit-card";
import Form from "./form";
import AirdropCountdown from "./AirdropCountdown";
import DeleteConfirmationModal from "./modals/DeleteConfirmationModal";
import SearchInput from "./SearchInput";
import TruncatedName from "./modals/TruncatedName";
import GlobalTime from "./modals/GlobalTime";
import Image from "next/image";

interface AirdropItem {
  _id?: string;
  name: string;
  countdown: number | string;
  attempt?: number;
  timer?: string;
  rating: number;
  support?: number;
}

const Airdrop: React.FC = () => {
  // const

  const [airdropData, setAirdropData] = useState<any[]>([]);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAirdropId, setSelectedAirdropId] = useState<string | null>(
    null
  );
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [expiredItems, setExpiredItems] = useState<{ [id: string]: boolean }>(
    {}
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [supportDesktopOnly, setSupportDesktopOnly] = useState(() => {
    const savedFilter = localStorage.getItem("supportDesktopOnly");
    return savedFilter ? JSON.parse(savedFilter) : false;
  });
  const [filteredAirdropData, setFilteredAirdropData] = useState<any[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabledLink, setIsDisabledLink] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);
  const [showResetButton, setShowResetButton] = useState(false); // State untuk tombol reset

  useEffect(() => {
    const fetchCountdown = async () => {
      try {
        const token = localStorage.getItem("token");
        const userDataString = localStorage.getItem("user");

        if (!token || !userDataString) {
          throw new Error("Authentication failed");
        }

        const userData = JSON.parse(userDataString);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}api/get-globaltimer`,
          {
            _id: userData.userId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const countdownData = response.data.countdown;
        setRemainingTime(countdownData.remainingTime);
        setIsCountdownActive(countdownData.isCountdownActive);

        // Set show reset button based on countdown status
        setShowResetButton(!countdownData.isCountdownActive);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // Handle 404 error
          if (error.response.status === 404) {
            console.error(
              "The API endpoint was not found. Please check the URL."
            );
          } else {
            console.error("Error fetching countdown:", error.message);
          }
        } else {
          // Handle other errors
          console.error("An unexpected error occurred:", error);
        }
      }
    };

    fetchCountdown();

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev !== null && prev > 0) {
          return prev - 1000;
        } else {
          // When timer expires, set countdown as inactive and show reset button
          setIsCountdownActive(false);
          setShowResetButton(true);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: number) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const toggleSupportFilter = () => {
    const newFilterState = !supportDesktopOnly;
    setSupportDesktopOnly(newFilterState);

    localStorage.setItem("supportDesktopOnly", JSON.stringify(newFilterState));
  };
  const [isSupportLoading, setSupportLoading] = useState(false); // Renamed loading state
  const [isSupportDisabled, setSupportDisabled] = useState(false); // Renamed disabled state

  const toggleAccordion = (index: number) => {
    // Create a copy of the current active indices
    const newActiveIndices = [...activeIndices];

    // Check if the index is already in the active indices
    const indexPosition = newActiveIndices.indexOf(index);

    if (indexPosition > -1) {
      // If the index is already active, remove it
      newActiveIndices.splice(indexPosition, 1);
    } else {
      // If the index is not active, add it
      newActiveIndices.push(index);
    }

    // Update state and local storage
    setActiveIndices(newActiveIndices);
    localStorage.setItem(
      "activeAccordionIndices",
      JSON.stringify(newActiveIndices)
    );
  };

  // On page load, check if there is a saved active accordion
  useEffect(() => {
    const savedIndices = localStorage.getItem("activeAccordionIndices");
    if (savedIndices) {
      setActiveIndices(JSON.parse(savedIndices));
    }
  }, []);

  const handleOpenNote = (airdropId: string) => {
    setSelectedAirdropId(airdropId);
    setIsNoteOpen(true);

    // Nonaktifkan tombol selama 4 detik
    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, 1000);
  };

  const handleCloseNote = () => {
    setIsNoteOpen(false);
    setSelectedAirdropId(null);
  };

  const handleOpenEdit = (airdropId: string) => {
    setSelectedAirdropId(airdropId);
    setIsEditOpen(true);

    // Nonaktifkan tombol selama 4 detik
    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, 1000);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedAirdropId(null);
    fetchAirdropData(); // Optional: fetch data when modal closes
  };

  const openDeleteConfirmation = (airdropId: string) => {
    setSelectedAirdropId(airdropId);
    setIsDeleteModalOpen(true);
  };

  // Fungsi untuk menutup konfirmasi modal delete
  const closeDeleteConfirmation = () => {
    setSelectedAirdropId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteAirdrop = async () => {
    if (!selectedAirdropId) return;

    try {
      const token = localStorage.getItem("token");
      const userDataString = localStorage.getItem("user");

      if (!token || !userDataString) {
        throw new Error("Authentication failed");
      }

      const userData = JSON.parse(userDataString);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/delete-airdrop`,
        {
          _id: userData.userId,
          airdropId: selectedAirdropId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchAirdropData();

      // Close modal after successful deletion
      closeDeleteConfirmation();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAirdropData = useCallback(async () => {
    try {
      setLoading(true); // Set loading true setiap kali dipanggil
      const token = localStorage.getItem("token");
      const userDataString = localStorage.getItem("user");

      if (!token || !userDataString) {
        throw new Error("Authentication token or user data not found");
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

      // Process airdrop data without fallback
      const processedAirdrops: AirdropItem[] = response.data.map(
        (item: AirdropItem) => {
          const countdownTimestamp = Number(item.countdown);

          return {
            ...item,
            countdown: countdownTimestamp,
          };
        }
      );

      localStorage.setItem("airdropData", JSON.stringify(processedAirdrops));
      setAirdropData(processedAirdrops);
      setFilteredAirdropData(processedAirdrops); // Initialize filtered data
    } catch (error) {
      setError(
        "Failed to retrieve airdrop data.Please wait 1 minute and logging in again."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAirdropData();
  }, [fetchAirdropData]);

  const sortedAirdropData = useMemo(() => {
    return filteredAirdropData.sort((a, b) => {
      // First, check if any item is expired
      const aIsExpired = expiredItems[a._id] || Date.now() > a.countdown;
      const bIsExpired = expiredItems[b._id] || Date.now() > b.countdown;

      // If one item is expired and the other is not, put the expired item first
      if (aIsExpired && !bIsExpired) return -1;
      if (!aIsExpired && bIsExpired) return 1;

      // If both are in the same expiration state, maintain original sorting
      return 0;
    });
  }, [filteredAirdropData, expiredItems]);

  const handleAttemptandResetTimer = async (
    airdropId: string,
    timer: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      const userDataString = localStorage.getItem("user");

      if (!token || !userDataString) {
        throw new Error("Authentication token or user data not found");
      }

      const userData = JSON.parse(userDataString);

      if (!airdropId) {
        throw new Error("Airdrop ID is not defined");
      }

      // Perform attempt
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/attempt`,
        {
          _id: userData.userId,
          airdropId: airdropId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset timer
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/reset-timer`,
        {
          _id: userData.userId,
          airdropId: airdropId,
          countdownMinute: timer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchAirdropData();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
      }
      console.error("Failed to make attempt request:", error);
    }
  };

  const handleCountdownExpire = (id: string, isExpired: boolean) => {
    setExpiredItems((prev) => ({
      ...prev,
      [id]: isExpired,
    }));
  };

  const handleClick = async (airdropId: string, timer: string) => {
    // Disable button for 4 seconds
    setIsDisabledLink(true);
    setTimeout(() => setIsDisabledLink(false), 4000);

    // Call your function
    await handleAttemptandResetTimer(airdropId, timer);
  };

  const toggleSupport = async (airdropId: string, support: number) => {
    if (isSupportLoading) return; // If still loading, ignore the click
    setSupportLoading(true); // Set loading state to true
    setSupportDisabled(true); // Disable the checkbox

    try {
      const token = localStorage.getItem("token");
      const userDataString = localStorage.getItem("user");

      if (!token || !userDataString) {
        throw new Error("Authentication token or user data not found");
      }

      const userData = JSON.parse(userDataString);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/support-desktop`,
        {
          _id: userData.userId,
          airdropId,
          support,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchAirdropData();
    } catch (error) {
      setError("Failed to update support status");
      console.error(error);
    } finally {
      // Add a delay of 4 seconds before enabling the checkbox again
      setTimeout(() => {
        setSupportLoading(false);
        setSupportDisabled(false); // Re-enable the checkbox after 4 seconds
      }, 4000); // 4 seconds delay
    }
  };

  // handleAirdropCreated
  const handleAirdropCreated = async (newAirdrop: any) => {
    setAirdropData((prevData) => [...prevData, newAirdrop]);
    await fetchAirdropData();
  };

  const renderAirdropSection = (rating: number) => {
    const isExpanded = activeIndices.includes(rating);

    return (
      <>
        {/* Accordion Header */}
        <div
          onClick={() => toggleAccordion(rating)}
          className="cursor-pointer bg-gray-900 text-base sm:text-lg font-semibold text-yellow-400 border-2 border-yellow-400/50 p-3 sm:p-4 mx-2 sm:mx-4 flex items-center justify-between rounded-t-xl shadow-lg backdrop-blur-sm hover:bg-gray-800 transition-colors"
        >
          <span className="ml-1 sm:ml-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
            Rating {rating} Airdrop
          </span>
          <span
            className={`${
              isExpanded ? "rotate-180" : ""
            } transform transition-transform text-yellow-400`}
          >
            ▲
          </span>
        </div>

        {/* Accordion Content with Improved Grid */}
        {isExpanded && (
          <div className="p-2 sm:p-4 md:p-6 border-2 border-yellow-400/50 border-t-0 mx-2 sm:mx-4 mb-4 text-white rounded-b-xl bg-gray-900/50 backdrop-blur-sm">
            <div className="flex flex-wrap gap-4 justify-center">
              {sortedAirdropData.map(
                (item, index) =>
                  item.rating == rating &&
                  (!supportDesktopOnly || item.support === 1) && (
                    <div
                      key={index}
                      className="w-[170px] sm:w-[450px] lg:w-[300px] h-full border-2 border-yellow-400/50 rounded-xl p-3 sm:p-4 shadow-lg bg-gray-800/50 backdrop-blur-sm"
                    >
                      {/* Card Header */}
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <div className="flex items-center text-gray-300">
                            <span className="text-sm mr-1">Attempts:</span>
                            <span className="font-medium text-yellow-400">
                              {item.attempt || "0"}
                            </span>
                          </div>
                          <div className="items-center mt-4 text-yellow-400 font-medium">
                            <TruncatedName name={item.name} />
                          </div>
                          <div className="flex items-center text-gray-300">
                            <span className="text-sm mr-1">Timer: </span>
                            <span className="font-medium text-yellow-400">
                              {item.timer}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <AirdropCountdown
                              countdown={item.countdown}
                              onExpire={(isExpired) =>
                                handleCountdownExpire(
                                  item._id || `${index}`,
                                  isExpired
                                )
                              }
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col ml-2">
                          <div className="flex gap-2 mb-2">
                            <button
                              className="cursor-pointer"
                              onClick={() => handleOpenNote(item.airdropId)}
                              disabled={isDisabled}
                            >
                              <Image
                                src="/assets/note-logo.png"
                                width={40} // Ganti sesuai kebutuhan
                                height={40} // Ganti sesuai kebutuhan
                                className="w-8 sm:w-10 border-2 border-yellow-400/50 rounded-lg hover:bg-yellow-400/80 p-1 bg-yellow-400/60 transition-colors"
                                alt="menu"
                              />
                            </button>

                            <button
                              onClick={() => handleOpenEdit(item.airdropId)}
                              disabled={isDisabled}
                              className="cursor-pointer"
                            >
                              <Image
                                src="/assets/pencil-logo.png"
                                width={32}
                                height={32}
                                className="w-8 sm:w-10 border-2 border-yellow-400/50 rounded-lg hover:bg-yellow-400/80 p-1 bg-yellow-400/60 transition-colors"
                                alt="edit"
                              />
                            </button>
                          </div>
                          <button
                            className="cursor-pointer self-end"
                            onClick={() =>
                              openDeleteConfirmation(item.airdropId)
                            }
                          >
                            <Image
                              src="/assets/trash-logo.png"
                              width={32}
                              height={32}
                              className="w-8 sm:w-10 border-2 border-red-500/50 rounded-lg hover:bg-red-500/80 bg-red-500/60 transition-colors"
                              alt="delete"
                            />
                          </button>
                        </div>
                      </div>

                      {/* Airdrop Play Section */}
                      <div className="mt-4">
                        <span className="text-gray-300 text-sm">
                          Airdrop Play:
                        </span>
                        <div className="flex gap-2 mt-2">
                          <a
                            href={
                              item.LinkTelegramPlay || "https://telegram.org"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                              handleClick(item.airdropId, item.timer)
                            }
                            style={{
                              pointerEvents: isDisabledLink ? "none" : "auto",
                              opacity: isDisabledLink ? 0.6 : 1,
                            }}
                          >
                            <Image
                              src="/assets/telegram.png"
                              width={32}
                              height={32}
                              className="w-8 sm:w-9 hover:border-blue-500 border-2 border-transparent rounded-lg transition-colors"
                              alt="telegram"
                            />
                          </a>
                          <a
                            href={item.LinkWebPlay || "https://google.com"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                              handleClick(item.airdropId, item.timer)
                            }
                            style={{
                              pointerEvents: isDisabledLink ? "none" : "auto",
                              opacity: isDisabledLink ? 0.6 : 1,
                            }}
                          >
                            <Image
                              src="/assets/web-logo.png"
                              width={32}
                              height={32}
                              className="w-8 sm:w-9 hover:border-blue-500 border-2 border-transparent rounded-lg transition-colors"
                              alt="web"
                            />
                          </a>
                        </div>
                      </div>

                      {/* Channel Announcement Section */}
                      <div className="mt-4">
                        <span className="text-gray-300 text-sm">
                          Channel Announcement:
                        </span>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex gap-2">
                            <a
                              href={
                                item.LinkTelegramChannel ||
                                "https://telegram.org"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src="/assets/telegram.png"
                                width={32}
                                height={32}
                                className="w-8 sm:w-9 hover:border-blue-500 border-2 border-transparent rounded-lg transition-colors"
                                alt="telegram"
                              />
                            </a>
                            <a
                              href={
                                item.LinkWebAnnountcement ||
                                "https://google.com"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src="/assets/web-logo.png"
                                width={32}
                                height={32}
                                className="w-8 sm:w-9 hover:border-blue-500 border-2 border-transparent rounded-lg transition-colors"
                                alt="web"
                              />
                            </a>
                            <a
                              href={item.LinkX || "https://google.com"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src="https://ik.imagekit.io/fs0yie8l6/1690643591twitter-x-logo-png.webp%20(1).png?updatedAt=1738293353975"
                                width={32}
                                height={32}
                                className="w-8 sm:w-9 hover:border-blue-500 border-2 border-transparent rounded-lg transition-colors"
                                alt="X"
                              />
                            </a>
                          </div>

                          <input
                            onClick={() =>
                              toggleSupport(
                                item.airdropId,
                                item.support == 1 ? 0 : 1
                              )
                            }
                            type="checkbox"
                            checked={item.support == 1}
                            className={`appearance-none w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-no-repeat bg-center cursor-pointer border-2 border-yellow-400/50 transition-colors ${
                              item.support == 1
                                ? "bg-yellow-400/60 hover:bg-yellow-400/80"
                                : "bg-transparent hover:bg-yellow-400/20"
                            }`}
                            disabled={isSupportDisabled}
                            style={{
                              pointerEvents: isSupportDisabled
                                ? "none"
                                : "auto",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-[rgb(107,114,128)]">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-2xl font-semibold text-gray-800">Loading...</div>
          <div className="w-16 h-16 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          <div className="text-sm text-gray-500">Please wait a moment</div>
        </div>
      </div>
    );

  if (error) return <div>{error}</div>;

  return (
    <div>
      <SearchInput
        airdropData={airdropData}
        setFilteredAirdropData={setFilteredAirdropData}
      />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {remainingTime !== null && isCountdownActive ? (
        <p className="text-xl text-yellow-300 font-semibold ml-4">
          Reset Attempt (07:00 WIB) : {formatTime(remainingTime)}
        </p>
      ) : showResetButton ? (
        <p className="text-xl text-red-500 font-semibold">
          <GlobalTime />
        </p>
      ) : null}
      <span className="ml-4">Total Airdrop: {filteredAirdropData.length}</span>
      <div className="flex items-center">
        <div className="ml-4">Dropdown All rating 3 rating 2 rating 1</div>
        <div className="flex items-center m-4">
          <label className="mr-4 flex items-center">
            <input
              type="checkbox"
              checked={supportDesktopOnly}
              onChange={toggleSupportFilter}
              className="mr-2 w-5 h-5"
            />
            <span>Desktop Only</span>
          </label>
        </div>
      </div>

      <div className="font-manrope">
        {renderAirdropSection(3)}
        {renderAirdropSection(2)}
        {renderAirdropSection(1)}
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={handleDeleteAirdrop}
      />
      <EditCard
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        airdropId={selectedAirdropId}
        onUpdate={fetchAirdropData}
      />
      <Note
        isOpen={isNoteOpen}
        onClose={handleCloseNote}
        airdropId={selectedAirdropId}
      />
      <Form onAirdropCreated={handleAirdropCreated} />
    </div>
  );
};

export default Airdrop;
