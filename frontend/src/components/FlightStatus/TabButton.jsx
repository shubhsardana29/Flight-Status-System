import PropTypes from "prop-types";
import { motion } from "framer-motion";


function TabButton({ icon, label, isActive, onClick }) {
    TabButton.propTypes = {
      icon: PropTypes.element.isRequired,
      label: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      onClick: PropTypes.func.isRequired,
    };
    return (
      <motion.button
        className={`flex-1 py-2 px-4 text-center ${
          isActive
            ? "text-blue-400 border-b-2 border-blue-400"
            : "text-gray-400 hover:text-gray-200"
        }`}
        onClick={onClick}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </motion.button>
    );
}
  
export default TabButton;
