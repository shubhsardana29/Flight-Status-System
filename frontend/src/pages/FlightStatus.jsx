import { useState, useEffect, useRef, useCallback } from "react";
import { getFlightStatus, updateFlightStatus } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaPlane,
  FaSearch,
  FaEdit,
  FaVolumeUp,
  FaVolumeMute,
  FaList,
} from "react-icons/fa";
import "../styles/custom-animations.css";
import { motion, AnimatePresence } from "framer-motion";
import AllFlights from "../components/AllFlights";
import BoardingPass from "../components/FlightStatus/BoardingPass";
import TabButton from "../components/FlightStatus/TabButton";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
import useWebSocket from "../hooks/useWebSocket";

function FlightStatus() {
  const previousStatusRef = useRef(null);
  const [flightId, setFlightId] = useState("");
  const [status, setStatus] = useState("");
  const [gate, setGate] = useState("");
  const [delay, setDelay] = useState("");
  const [flightInfo, setFlightInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("check");
  const [realTimeUpdate, setRealTimeUpdate] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const updateTimerRef = useRef(null);
  const navigate = useNavigate();

  const { audioEnabled, setAudioEnabled, speakNotification } = useSpeechSynthesis();

  const handleWebSocketMessage = useCallback(
    (parsedData) => {
      if (
        typeof parsedData === "object" &&
        parsedData.flight_id &&
        parsedData.status
      ) {
        const message = `Attention Passengers, Flight ${parsedData.flight_id} status updated to ${parsedData.status}`;
        speakNotification(message);
      }
      if (flightInfo && parsedData.flight_id === flightInfo.flight_id) {
        setFlightInfo(parsedData);
      }
      setRealTimeUpdate(parsedData);
      setShowUpdate(true);

      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }

      updateTimerRef.current = setTimeout(() => {
        setShowUpdate(false);
      }, 10000);
    },
    [flightInfo, speakNotification]
  );

  const { wsConnected } = useWebSocket(
    "wss://flight-status-system.onrender.com/ws",
    handleWebSocketMessage
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    return () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
    };
  }, [navigate]);

  const handleGetFlightStatus = async () => {
    if (!flightId) {
      setError("Please enter a Flight ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await getFlightStatus(flightId);
      setFlightInfo(response.data);
      if (previousStatusRef.current !== response.data.status) {
        previousStatusRef.current = response.data.status;
        speakNotification(
          `Flight ${flightId} status is ${response.data.status}`
        );
      }
      setError("");
    } catch (error) {
      console.error("Error fetching flight status:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        setError("Token Expired, Please log in again to continue.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError("Error fetching flight status. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateFlightStatus = async (e) => {
    e.preventDefault();
    if (!flightId) {
      setError("Please enter a Flight ID.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        flight_id: flightId,
        status,
        gate: gate || null,
        delay: delay || null,
      };
      const response = await updateFlightStatus(payload);
      setFlightInfo(response.data);
      speakNotification(
        `Flight ${flightId} status has been updated to ${status}`
      );
      setError("");
    } catch (error) {
      console.error("Error adding or updating flight status:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        setError("Token Expired, Please log in again to continue.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError("Error adding or updating flight status. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
      </motion.div>
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="bg-black bg-opacity-70 rounded-lg shadow-2xl overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 sm:p-10">
            <div className="flex justify-between items-center mb-6">
              <motion.div
                className="flex items-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <FaPlane className="text-5xl text-blue-400 mr-4" />
                <h1 className="text-4xl font-extrabold text-white">
                  Flight Status
                </h1>
              </motion.div>
              <motion.button
                onClick={() => {
                  setAudioEnabled(!audioEnabled);
                  speakNotification(
                    audioEnabled ? "Audio disabled" : "Audio enabled"
                  );
                }}
                className="text-white focus:outline-none p-2 bg-blue-600 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {audioEnabled ? (
                  <FaVolumeUp size={24} />
                ) : (
                  <FaVolumeMute size={24} />
                )}
              </motion.button>
            </div>
            <p
              className={`mb-4 ${
                wsConnected ? "text-green-400" : "text-red-400"
              }`}
            >
              WebSocket: {wsConnected ? "Connected" : "Disconnected"}
            </p>

            <AnimatePresence>
              {showUpdate && realTimeUpdate && (
                <motion.div
                  className="bg-yellow-400 text-yellow-900 p-4 mb-6 rounded-lg"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <p className="font-bold">Real-time Update</p>
                  <pre className="whitespace-pre-wrap">
                    {typeof realTimeUpdate === "string"
                      ? realTimeUpdate
                      : JSON.stringify(realTimeUpdate, null, 2)}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-6">
              <div className="flex border-b border-gray-600">
                <TabButton
                  icon={<FaSearch />}
                  label="Check Status"
                  isActive={activeTab === "check"}
                  onClick={() => setActiveTab("check")}
                />
                <TabButton
                  icon={<FaEdit />}
                  label="Update Status"
                  isActive={activeTab === "update"}
                  onClick={() => setActiveTab("update")}
                />
                <TabButton
                  icon={<FaList />}
                  label="All Flights"
                  isActive={activeTab === "all"}
                  onClick={() => setActiveTab("all")}
                />
              </div>
            </div>

            {activeTab === "check" && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Enter Flight ID"
                    value={flightId}
                    onChange={(e) => setFlightId(e.target.value)}
                    className="flex-1 p-3 bg-gray-800 text-white border border-gray-600 rounded-lg shadow-inner focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <motion.button
                    onClick={handleGetFlightStatus}
                    className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Get Status"}
                  </motion.button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {flightInfo && <BoardingPass flightInfo={flightInfo} />}
              </motion.div>
            )}

            {activeTab === "update" && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col space-y-4">
                  <input
                    type="text"
                    placeholder="Enter Flight ID"
                    value={flightId}
                    onChange={(e) => setFlightId(e.target.value)}
                    className="p-3 bg-gray-800 text-white border border-gray-600 rounded-lg shadow-inner focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <input
                    type="text"
                    placeholder="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="p-3 bg-gray-800 text-white border border-gray-600 rounded-lg shadow-inner focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <input
                    type="text"
                    placeholder="Gate (optional)"
                    value={gate}
                    onChange={(e) => setGate(e.target.value)}
                    className="p-3 bg-gray-800 text-white border border-gray-600 rounded-lg shadow-inner focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <input
                    type="text"
                    placeholder="Delay (optional)"
                    value={delay}
                    onChange={(e) => setDelay(e.target.value)}
                    className="p-3 bg-gray-800 text-white border border-gray-600 rounded-lg shadow-inner focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                <motion.button
                  onClick={handleAddOrUpdateFlightStatus}
                  className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Update Status"}
                </motion.button>
                {error && <p className="text-red-500">{error}</p>}
              </motion.div>
            )}

            {activeTab === "all" && <AllFlights />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default FlightStatus;