// App.jsx
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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const isSpecialPage =
    location.pathname === "/login" ||
    location.pathname.startsWith("/scan/") ||
    location.pathname.startsWith("/coupons/redeem");

  return (
    <div className="min-h-screen bg-gray-100">
      {!isSpecialPage && <Sidebar open={sidebarOpen} close={closeSidebar} />}

      <div className={!isSpecialPage ? "md:pl-64 transition-all duration-300" : ""}>
        {!isSpecialPage && <Navbar toggleSidebar={toggleSidebar} />}

        <div className={!isSpecialPage ? "pt-20 p-6" : ""}>
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
            <Route path="/invoice-form" element={<InvoiceForm/>}/>
            <Route path="/Shope-invoice-List/:shopId" element={<InvoiceList/>}/>
            <Route path="/AllInvoices" element={<AllInvoice/>}/>
            <Route path="/invoice/:id" element={<InvoiceView />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}
