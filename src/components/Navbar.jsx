// Navbar.jsx
import { useState } from "react";
import { FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Navbar({ toggleSidebar }) {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="
        w-full bg-white shadow p-4 fixed top-0 left-0 
        flex justify-between items-center
        md:pl-64
      "
    >
      <button className="md:hidden text-gray-700 text-2xl" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>

      <div className="relative z-50 flex items-center">
        <button
          className="flex items-center"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <FaUserCircle size={28} style={{ color: "red" }} />
        </button>

        {openMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border py-2 z-50">
            <button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700">
              Profile
            </button>

            <button
              onClick={() => navigate("/login")}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600 flex items-center gap-2"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
