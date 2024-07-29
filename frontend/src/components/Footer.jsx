import { FaPlane, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-12 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaPlane className="text-2xl text-indigo-400" />
              <h1 className="text-2xl font-bold">Interglobe Aviation</h1>
            </div>
            <p className="text-indigo-200 text-sm">Soaring to new heights, connecting the world.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4 text-indigo-300">Quick Links</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-indigo-100 hover:text-white transition duration-300">Flight Schedule</a></li>
              <li><a href="#" className="text-indigo-100 hover:text-white transition duration-300">Check-in Online</a></li>
              <li><a href="#" className="text-indigo-100 hover:text-white transition duration-300">Baggage Information</a></li>
              <li><a href="#" className="text-indigo-100 hover:text-white transition duration-300">Travel Insurance</a></li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4 text-indigo-300">About Us</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-indigo-100 hover:text-white transition duration-300">Our Story</a></li>
              <li><a href="#" className="text-indigo-100 hover:text-white transition duration-300">Press Releases</a></li>
              <li><a href="#" className="text-indigo-100 hover:text-white transition duration-300">Careers</a></li>
              <li><a href="#" className="text-indigo-100 hover:text-white transition duration-300">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4 text-indigo-300">Connect With Us</h2>
            <div className="flex space-x-4">
              <a href="#" className="bg-indigo-700 p-2 rounded-full hover:bg-indigo-600 transition duration-300">
                <FaFacebookF className="text-xl" />
              </a>
              <a href="#" className="bg-indigo-700 p-2 rounded-full hover:bg-indigo-600 transition duration-300">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="bg-indigo-700 p-2 rounded-full hover:bg-indigo-600 transition duration-300">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="bg-indigo-700 p-2 rounded-full hover:bg-indigo-600 transition duration-300">
                <FaLinkedinIn className="text-xl" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-indigo-800 text-center">
          <p className="text-indigo-300 text-sm">
            © {new Date().getFullYear()} Interglobe Aviation. All rights reserved.
          </p>
          <div className="mt-4 space-x-4 text-sm">
            <a href="#" className="text-indigo-300 hover:text-white transition duration-300">Privacy Policy</a>
            <a href="#" className="text-indigo-300 hover:text-white transition duration-300">Terms of Service</a>
            <a href="#" className="text-indigo-300 hover:text-white transition duration-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;