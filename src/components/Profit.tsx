import React, { useState, useEffect } from "react";
import axios from "axios";

// Define interface for the data structure
interface AirdropDetail {
  airdropId: string;
  name: string;
  modal: number;
  profit: number;
  PNL: number;
}

interface AnalysisData {
  totalModal: number;
  totalProfit: number;
  PNL: number;
  count: number;
  details: AirdropDetail[];
}

interface ProfitProps {
  isOpen: boolean;
  onClose: () => void;
}

const Profit: React.FC<ProfitProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchAnalysisData();
    }
  }, [isOpen]);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if token exists
      const token = localStorage.getItem('token') || localStorage.getItem('bearerToken');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        return;
      }

      // Dynamic API URL based on environment
      const getApiUrl = () => {
        // Check if we're in browser and on localhost
        if (typeof window !== 'undefined') {
          const hostname = window.location.hostname;
          
          // If accessing from localhost, use localhost backend
          if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:4000';
          }
        }
        
        // For production/deployed version, use your deployed backend URL
        // Replace this with your actual deployed backend URL
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      };

      const apiUrl = getApiUrl();
      
      const response = await axios.get<AnalysisData>(`${apiUrl}/api/get-analysis`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000,
        withCredentials: false
      });
      
      setData(response.data);
    } catch (err: any) {
      let errorMessage = 'Failed to fetch analysis data';
      
      if (err.code === 'ERR_NETWORK') {
        errorMessage = `Cannot connect to server. ${
          typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
            ? 'Backend server needs to be deployed for production use.' 
            : 'Please ensure the backend server is running on localhost:4000.'
        }`;
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        localStorage.removeItem('token');
        localStorage.removeItem('bearerToken');
      } else if (err.response?.status === 403) {
        errorMessage = 'Access forbidden. You do not have permission to access this resource.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      console.error('Error fetching analysis:', err);
      console.log('Current environment:', {
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
        apiUrl: typeof window !== 'undefined' ? (window.location.hostname === 'localhost' ? 'http://localhost:4000' : process.env.NEXT_PUBLIC_API_URL) : 'unknown'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setData(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      {error && (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
          {error}
        </div>
      )}

      <div className="bg-zinc-900 border-2 border-yellow-400 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-yellow-400/30">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-yellow-400">
              Profit Analysis
            </h2>
            <button
              onClick={handleClose}
              className="text-yellow-400 hover:text-yellow-300 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Summary Section */}
              <div className="bg-zinc-800 rounded-lg p-4 border border-yellow-400/20">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Total Modal</div>
                    <div className="text-xl font-bold text-white">${data.totalModal}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Total Profit</div>
                    <div className="text-xl font-bold text-green-400">${data.totalProfit}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">PNL</div>
                    <div className={`text-xl font-bold ${data.PNL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${data.PNL}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Count</div>
                    <div className="text-xl font-bold text-white">{data.count}</div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-400">Details</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {data.details && data.details.length > 0 ? (
                    data.details.map((item, index) => (
                      <div key={item.airdropId || index} className="bg-zinc-800 rounded-lg p-4 border border-yellow-400/20">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-medium text-yellow-400 capitalize">
                            {item.name}
                          </h4>
                          <div className={`text-sm font-medium px-2 py-1 rounded ${
                            item.PNL >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            PNL: ${item.PNL}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex space-x-6">
                            <div>
                              <span className="text-sm text-gray-400">Modal: </span>
                              <span className="text-white font-medium">${item.modal}</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-400">Profit: </span>
                              <span className="text-green-400 font-medium">${item.profit}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      No details available
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-gray-400">
                <div className="text-lg mb-2">No data available</div>
                <button 
                  onClick={fetchAnalysisData}
                  className="px-4 py-2 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400/10"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-yellow-400/30">
          <div className="flex justify-end gap-4">
            <button
              onClick={handleClose}
              className="px-6 py-2 border-2 border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400/10"
            >
              Close            
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profit;
