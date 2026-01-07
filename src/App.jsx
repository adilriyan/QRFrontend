// App.jsx - COMPLETE CLEAN FIX
import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Shops from "./pages/Shops";
import ViewCoupon from "./pages/ViewCoupon";
import ScanPage from "./pages/ScanPage";
import QrPages from "./pages/QrPages";
import AddShop from "./pages/AddShop";
import AddCoupon from "./pages/AddCoupon";
import RedeemPage from "./pages/RedeemPage";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AnalyticsPage from "./AnalyiticsPage";
import InvoiceForm from "./pages/InvoiceForm";
import InvoiceList from "./pages/InvoiceList_Page";
import AllInvoice from "./pages/AllInvoice";
import InvoiceView from "./pages/InvoiceView";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const isSpecialPage =
    location.pathname === "/login" ||
    location.pathname.startsWith("/scan/") ||
    location.pathname.startsWith("/coupons/redeem");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      
      {/* SIDEBAR */}
      {!isSpecialPage && (
        <Sidebar open={sidebarOpen} close={closeSidebar} />
      )}

      {/* NAVBAR */}
      {!isSpecialPage && (
        <Navbar toggleSidebar={toggleSidebar} />
      )}

      {/* MAIN CONTENT */}
      <main className={`
        min-h-screen
        transition-all duration-300
        ${
          isSpecialPage
            ? "pt-0 px-4 sm:px-6 lg:px-8"
            : "pt-[5.5rem] lg:pl-[18rem] px-4 sm:px-6 lg:px-8 xl:px-12 pb-12"
        }
      `}>
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/shops" element={<Shops />} />
            <Route path="/viewCoupon/:id" element={<ViewCoupon />} />
            <Route path="/scan/:templateCode" element={<ScanPage />} />
            <Route path="/qrpages" element={<QrPages />} />
            <Route path="/addShop" element={<AddShop />} />
            <Route path="/addCoupon" element={<AddCoupon />} />
            <Route path="/coupons/redeem/:userCouponId" element={<RedeemPage />} />
            <Route path="/analytics/:shopId" element={<AnalyticsPage />} />
            <Route path="/invoice-form" element={<InvoiceForm />} />
            <Route path="/Shope-invoice-List/:shopId" element={<InvoiceList />} />
            <Route path="/AllInvoices" element={<AllInvoice />} />
            <Route path="/invoice/:id" element={<InvoiceView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
