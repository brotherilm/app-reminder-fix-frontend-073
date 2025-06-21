import React, { useState, useEffect } from "react";
import { Copy, Check, X } from "lucide-react";

interface ExchangeProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddressData {
  [exchange: string]: {
    [network: string]: string;
  };
}

const Exchange: React.FC<ExchangeProps> = ({ isOpen, onClose }) => {
  const [selectedExchange, setSelectedExchange] = useState<string>("");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [copiedAddress, setCopiedAddress] = useState<string>("");
  const [data, setData] = useState<AddressData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Data alamat untuk setiap exchange dan network
  const addressData: AddressData = {
    Binance: {
      EVM: "0x562c3d395dd74eef88226f09b08baa532a0d3c99",
      SUI: "0x2ff3c7eaeb11bd0624103fbf9212413114cb14652cb8f91d9d48027000608ffb",
      Solana: "DXCfcpYj21PwCd2zCAFi5H6hoa891T98dCFdsFhj6u3u",
    },
    Bybit: {
      EVM: "0xe58d6fe33ba599abf035e323f47b85b9906ac53e",
      SUI: "0xd0d133ba7123c8be2600ebec5f6f525d23755211ae35bd51fc396cabf835a317",
      Solana: "ARaH9bYDhg6jFYBNavLQ2aAG2PTmsRMipiTB4J88mEWx",
    },
    Flipster: {
      EVM: "0x709B9Cc9Fdfe8FE0df0A87BA70314B62B2f50832",
      SUI: "0x59ae3c335bea5f339416d526681d17388c6670c29609281ce19bffada12c33e5",
      Solana: "7iQ5pS43gkDK3C3FmdnUWfUTLmYeeMSy5yGET8yLiMsu",
    },
    MEXC: {
      EVM: "0x5a7bc95bbe48c9420cd101828a19ac91e8706f22",
      SUI: "0x73e69bfdeee9e883dac41d9debcab11e51589dd106b004538493430e273c2beb",
      Solana: "yKT3SZYXfSjpXUaXuas1aBFQSPFen5hjcdtLXK2wEtX",
    },
  };

  const exchanges = Object.keys(addressData);
  const networks = selectedExchange
    ? Object.keys(addressData[selectedExchange])
    : [];

  useEffect(() => {
    if (isOpen) {
      setData(addressData);
      // Set default values
      if (exchanges.length > 0) {
        setSelectedExchange(exchanges[0]);
        setSelectedNetwork(Object.keys(addressData[exchanges[0]])[0]);
      }
    }
  }, [isOpen]);

  const handleCopy = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(""), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
      setError("Failed to copy address to clipboard");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleExchangeChange = (exchange: string) => {
    setSelectedExchange(exchange);
    // Reset network to first available when exchange changes
    const availableNetworks = Object.keys(addressData[exchange]);
    if (availableNetworks.length > 0) {
      setSelectedNetwork(availableNetworks[0]);
    }
  };

  const handleClose = () => {
    setData(null);
    setError(null);
    setSelectedExchange("");
    setSelectedNetwork("");
    setCopiedAddress("");
    onClose();
  };

  const getCurrentAddress = () => {
    if (selectedExchange && selectedNetwork && data) {
      return data[selectedExchange][selectedNetwork];
    }
    return "";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="w-full h-full max-w-4xl max-h-[90vh]">
        {/* Error Toast */}
        {error && (
          <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg z-20">
            {error}
          </div>
        )}

        {/* Modal Container */}
        <div className="bg-black border-4 border-yellow-300 rounded-2xl shadow-xl w-full h-full flex flex-col">
          {/* Fixed Header */}
          <div className="sticky top-0 bg-black z-10 px-6 py-4 border-b rounded-t-2xl border-yellow-300">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-yellow-300">
                Exchange Addresses
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-yellow-300 text-yellow-300 rounded-lg hover:bg-yellow-300 hover:text-black transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* All Addresses Display */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-300">
                  All Available Addresses
                </h3>
                {Object.entries(addressData).map(([exchange, networks]) => (
                  <div
                    key={exchange}
                    className="bg-gray-900 border-2 border-yellow-300/50 rounded-xl p-4"
                  >
                    <h4 className="font-medium text-yellow-300 mb-4 text-lg">
                      {exchange}
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(networks).map(([network, address]) => (
                        <div
                          key={network}
                          className="bg-gray-800 border border-yellow-300/30 rounded-lg p-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 mr-4">
                              <div className="text-yellow-300 font-medium mb-1">
                                {network}
                              </div>
                              <div className="text-yellow-300/80 font-mono text-sm break-all">
                                {address}
                              </div>
                            </div>
                            <button
                              onClick={() => handleCopy(address)}
                              className="p-2 text-yellow-300/70 hover:text-yellow-300 hover:bg-yellow-300/10 rounded-lg transition-colors flex-shrink-0"
                              title="Copy address"
                            >
                              {copiedAddress === address ? (
                                <Check size={18} className="text-green-400" />
                              ) : (
                                <Copy size={18} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exchange;
