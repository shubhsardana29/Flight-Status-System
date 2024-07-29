import { GlobeDemo } from '../components/Globedemo';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlane, FaSearch } from 'react-icons/fa';

function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Interglobe Aviation</h1>
          <p className="text-xl text-blue-300">Explore the world with us</p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 mb-8 md:mb-0"
          >
            <h2 className="text-3xl font-semibold mb-4">Check Your Flight Status</h2>
            <p className="text-gray-300 mb-6">Stay updated with real-time information about your flight.</p>
            <Link
              to="/status"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <FaSearch className="mr-2" />
              Check Status
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="md:w-1/2"
          >
            <GlobeDemo />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-semibold mb-4">Discover Our Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard icon={<FaPlane />} title="Book a Flight" description="Find and book your next adventure" />
            <ServiceCard icon={<FaSearch />} title="Flight Status" description="Get real-time updates on your flight" />
            <ServiceCard icon={<FaPlane className="transform rotate-45" />} title="Destinations" description="Explore our range of destinations" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import PropTypes from 'prop-types';

function ServiceCard({ icon, title, description }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-2">
      <div className="text-blue-400 text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

ServiceCard.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Home;