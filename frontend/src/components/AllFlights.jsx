import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAllFlights } from "../services/api";
import { FaPlane, FaClock, FaDoorOpen, FaExclamationTriangle } from "react-icons/fa";
import { getBoardingStatus } from "../utils/flightStatusUtils";

const AllFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        const response = await getAllFlights();
        setFlights(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flights:", error);
        if (error.response && error.response.status === 401) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setError("Failed to fetch flights. Please try again later.");
        }
        setLoading(false);
      }
    };

    fetchFlights();
  }, [navigate]);

  const getStatusColor = (status) => {
    const boardingStatus = getBoardingStatus(status);
    switch (boardingStatus) {
      case "Now":
        return "bg-green-500";
      case "Delayed":
        return "bg-yellow-500";
      case "On Time":
        return "bg-blue-500";
      case "Cancelled":
        return "bg-red-500";
      case "Completed":
        return "bg-gray-500";
      default:
        return "bg-purple-500";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaPlane className="text-6xl text-blue-500" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
        <div className="flex items-center">
          <FaExclamationTriangle className="text-2xl mr-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      <motion.div
        className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg shadow-2xl overflow-hidden"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 sm:p-10">
          <motion.div
            className="flex items-center mb-8"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <FaPlane className="text-5xl text-blue-400 mr-4" />
            <h1 className="text-4xl font-extrabold text-white">All Flights</h1>
          </motion.div>
          {flights.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <AnimatePresence>
                {flights.map((flight) => (
                  <motion.div
                    key={flight.flight_id}
                    className="bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200"
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { y: 0, opacity: 1 }
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <div className={`${getStatusColor(flight.status)} h-2`} />
                    <div className="p-6">
                      <h3 className="text-2xl font-semibold mb-4 text-center">
                        {flight.flight_id}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                          <FaPlane className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <p className="text-lg font-semibold">{getBoardingStatus(flight.status)}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FaDoorOpen className="text-green-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-600">Gate</p>
                            <p className="text-lg font-semibold">{flight.gate || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <FaClock className="text-yellow-500 mr-2" />
                        <p className="text-sm text-gray-600">Delay</p>
                        <p className="text-lg font-semibold ml-2">
                          {flight.delay ? `${flight.delay} minutes` : "No Delay"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.p
              className="text-white text-center text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              No flights available.
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AllFlights;