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
  const baseLink =
    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200";
  const linkClass =
    baseLink +
    " text-slate-300 hover:text-slate-100 hover:bg-slate-800/70";
  const activeLinkClass =
    baseLink +
    " bg-teal-500/90 text-white shadow-lg shadow-teal-500/25";

  return (
    <>
 
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={close}
        />
      )}

   
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64
          bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/80
          shadow-2xl shadow-slate-900/70
          px-4 py-6 z-50
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-64"}
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-teal-500/40">
              Q
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-slate-100">
                QR Market
              </p>
              <p className="text-[11px] text-slate-400">
                Merchant Console
              </p>
            </div>
          </div>

          <button
            className="text-slate-400 hover:text-slate-100 text-2xl"
            onClick={close}
          >
            <FaTimes />
          </button>
        </div>

        <nav className="space-y-1 text-sm">
          <p className="px-3 pb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Overview
          </p>

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? activeLinkClass : linkClass
            }
            onClick={close}
          >
            <FaHome className="text-base" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/shops"
            className={({ isActive }) =>
              isActive ? activeLinkClass : linkClass
            }
            onClick={close}
          >
            <FaStore className="text-base" />
            <span>Shops</span>
          </NavLink>

          <NavLink
            to="/addShop"
            className={({ isActive }) =>
              isActive ? activeLinkClass : linkClass
            }
            onClick={close}
          >
            <FaPlus className="text-base" />
            <span>Add Shop</span>
          </NavLink>

          <p className="px-3 pt-4 pb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Coupons & Billing
          </p>

          <NavLink
            to="/qrpages"
            className={({ isActive }) =>
              isActive ? activeLinkClass : linkClass
            }
            onClick={close}
          >
            <FaQrcode className="text-base" />
            <span>Coupons</span>
          </NavLink>

          <NavLink
            to="/addCoupon"
            className={({ isActive }) =>
              isActive ? activeLinkClass : linkClass
            }
            onClick={close}
          >
            <FaFileAlt className="text-base" />
            <span>Add Coupon</span>
          </NavLink>

          <NavLink
            to="/invoice-form"
            className={({ isActive }) =>
              isActive ? activeLinkClass : linkClass
            }
            onClick={close}
          >
            <FaFileAlt className="text-base" />
            <span>Bill Form</span>
          </NavLink>

          <NavLink
            to="/AllInvoices"
            className={({ isActive }) =>
              isActive ? activeLinkClass : linkClass
            }
            onClick={close}
          >
            <FaFileAlt className="text-base" />
            <span>All Invoices</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
