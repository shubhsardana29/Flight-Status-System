import { FaClock, FaDoorOpen , FaPlane} from 'react-icons/fa';
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { getBoardingStatus } from "../../utils/flightStatusUtils";

function BoardingPass({ flightInfo }) {
    BoardingPass.propTypes = {
      flightInfo: PropTypes.object.isRequired,
    };
  
    return (
      <motion.div
        className="bg-white text-gray-900 p-6 rounded-lg shadow-inner mt-4 relative overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-center">Boarding Pass</h3>
        <div className="border-t border-b border-dashed border-gray-300 py-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm text-gray-600">Flight</p>
              <p className="text-xl font-bold">{flightInfo.flight_id}</p>
            </div>
            <motion.div
              animate={{
                x: ["0%", "100%"],
                transition: {
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 5,
                    ease: "linear",
                  },
                },
              }}
              className="absolute inset-0 pointer-events-none"
            >
              <FaPlane className="text-4xl text-blue-600 opacity-30" />
            </motion.div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold">{flightInfo.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gate</p>
              <p className="text-lg font-semibold">
                {flightInfo.gate ? flightInfo.gate : "Not Assigned"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaClock className="text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Delay</p>
              <p className="text-lg font-semibold">
                {flightInfo.delay !== null && flightInfo.delay !== ""
                  ? `${flightInfo.delay} minutes`
                  : "No Delay"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <FaDoorOpen className="text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Boarding</p>
              <p className="text-lg font-semibold">
                {getBoardingStatus(flightInfo.status)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

export default BoardingPass;