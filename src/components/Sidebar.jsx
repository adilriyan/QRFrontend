// Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  FaTimes,
  FaHome,
  FaStore,
  FaPlus,
  FaQrcode,
  FaFileAlt,
} from "react-icons/fa";

export default function Sidebar({ open, close }) {
  const linkClass =
    "flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition";
  const activeLinkClass =
    "flex items-center gap-3 p-3 rounded-lg bg-teal-600 text-white transition";

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-5 z-50
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-64"}
          md:translate-x-0
        `}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-teal-700">QR Market</h1>
          <button className="text-gray-700 text-2xl md:hidden" onClick={close}>
            <FaTimes />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink to="/" className={({ isActive }) => (isActive ? activeLinkClass : linkClass)} onClick={close}>
            <FaHome /> Dashboard
          </NavLink>

          <NavLink to="/shops" className={({ isActive }) => (isActive ? activeLinkClass : linkClass)} onClick={close}>
            <FaStore /> Shops
          </NavLink>

          <NavLink to="/addShop" className={({ isActive }) => (isActive ? activeLinkClass : linkClass)} onClick={close}>
            <FaPlus /> Add Shop
          </NavLink>

          <NavLink to="/qrpages" className={({ isActive }) => (isActive ? activeLinkClass : linkClass)} onClick={close}>
            <FaQrcode /> Coupons
          </NavLink>

          <NavLink to="/addCoupon" className={({ isActive }) => (isActive ? activeLinkClass : linkClass)} onClick={close}>
            <FaFileAlt /> Add Coupon
          </NavLink>
           <NavLink to="/invoice-form" className={({ isActive }) => (isActive ? activeLinkClass : linkClass)} onClick={close}>
            <FaFileAlt /> Bill Form
          </NavLink>
           <NavLink to="/AllInvoices" className={({ isActive }) => (isActive ? activeLinkClass : linkClass)} onClick={close}>
            <FaFileAlt /> All Invoices
          </NavLink>
        </nav>
      </div>
    </>
  );
}
