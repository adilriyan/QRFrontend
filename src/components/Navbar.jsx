// Navbar.jsx
import { useState } from "react";
import { FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ toggleSidebar }) {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitleMap = {
    "/": "Dashboard",
    "/shops": "Shops",
    "/addShop": "Add Shop",
    "/qrpages": "Coupons",
    "/addCoupon": "Add Coupon",
    "/invoice-form": "Invoice Form",
    "/AllInvoices": "All Invoices",
  };

  const currentTitle = pageTitleMap[location.pathname] || "Dashboard";

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div
        className="
          bg-slate-900/70 backdrop-blur-xl border-b border-slate-800/80
          shadow-lg shadow-slate-950/50
          flex items-center justify-between
          px-4 md:px-6 lg:px-8 py-3
        "
      >
        <div className="flex items-center gap-3">
       
          <button
            className="
              inline-flex items-center justify-center h-9 w-9 rounded-full
              bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 transition
            "
            onClick={toggleSidebar}
          >
            <FaBars className="text-lg" />
          </button>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              QR Market
            </p>
            <h2 className="text-lg font-semibold text-slate-100">
              {currentTitle}
            </h2>
          </div>
        </div>

        <div className="relative z-50 flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end text-xs">
            <span className="text-slate-300 font-medium">Admin</span>
            <span className="text-slate-500">Logged in</span>
          </div>

          <button
            className="
              flex items-center justify-center h-9 w-9 rounded-full
              bg-gradient-to-tr from-teal-500 to-emerald-400
              text-slate-950 shadow-md shadow-teal-500/40
              hover:brightness-110 transition
            "
            onClick={() => setOpenMenu((prev) => !prev)}
          >
            <FaUserCircle className="text-xl" />
          </button>

          {openMenu && (
            <div
              className="
                absolute right-0 top-11 w-44
                bg-slate-900/95 backdrop-blur-xl
                border border-slate-800/80
                rounded-xl shadow-xl shadow-slate-950/60
                py-2
              "
            >
              <button className="w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-800/80">
                Profile
              </button>

              <div className="border-t border-slate-800/80 my-1" />

              <button
                onClick={() => {
                  setOpenMenu(false);
                  navigate("/login");
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-800/80 flex items-center gap-2"
              >
                <FaSignOutAlt className="text-sm" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
