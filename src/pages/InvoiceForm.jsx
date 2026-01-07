import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api";
import InvoicePreview from "../components/Shared_Invoice_Preview";

// Convert number to words
const numberToWords = (num) => {
  const a = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const b = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if ((num = num.toString()).length > 9) return "overflow";
  let n = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);

  if (!n) return "";
  let str = "";
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) +
        " crore "
      : "";
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) +
        " lakh "
      : "";
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) +
        " thousand "
      : "";
  str +=
    n[4] != 0
      ? a[Number(n[4])] + " hundred "
      : "";
  str +=
    n[5] != 0
      ? (str != "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
        " "
      : "";
  return str.trim() + " rupees";
};

export default function InvoiceForm() {
  const nav = useNavigate();

  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [selectedShop, setSelectedShop] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // Load shops
  useEffect(() => {
    API.get("/shops/all")
      .then((res) => {
        setShops(res.data.shops || []);
        setLoading(false);
      })
      .catch(() => {
        setErrorMsg("Failed to load shops.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const shop = shops.find((s) => s._id === selectedShopId);
    setSelectedShop(shop || null);
  }, [selectedShopId, shops]);

  // Invoice Data
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  const [eventDate, setEventDate] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventType, setEventType] = useState("");

  const [discount, setDiscount] = useState(0);

  const [items, setItems] = useState([{ name: "", qty: 1, price: 0 }]);

  const addItem = () =>
    setItems([...items, { name: "", qty: 1, price: 0 }]);
  const removeItem = (i) =>
    items.length > 1 &&
    setItems(items.filter((_, idx) => idx !== i));

  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.qty) * Number(i.price),
    0
  );

  const totalAmount = subtotal - Number(discount);

  const amountInWords = numberToWords(totalAmount);

  // Submit form
  const submit = async (e) => {
    e.preventDefault();

    if (!selectedShopId) {
      alert("Please select a shop");
      return;
    }

    try {
      await API.post(`/invoice/create`, {
        shopId: selectedShopId,
        customerName,
        customerPhone,
        paymentMethod,
        notes,
        eventDate,
        eventPlace,
        eventTime,
        eventType,
        items,
        subtotal,
        discount,
        totalAmount,
        amountInWords,
      });

      alert("Invoice created");
      // nav(`/invoice-list`);
    } catch (err) {
      console.error(err);
      alert("Invoice creation failed");
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Page Header Skeleton */}
        <div className="space-y-2">
          <div className="h-12 w-80 bg-slate-800/50 rounded-2xl animate-pulse"></div>
          <div className="h-4 w-64 bg-slate-800/30 rounded-xl animate-pulse"></div>
        </div>

        {/* Form Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl animate-pulse space-y-6">
            <div className="space-y-4">
              <div className="h-8 w-48 bg-slate-800/50 rounded-xl"></div>
              <div className="h-12 w-full bg-slate-800/50 rounded-2xl"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-slate-800/30 rounded"></div>
                  <div className="h-10 w-full bg-slate-800/50 rounded-xl"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-20 bg-slate-800/30 rounded"></div>
                  <div className="h-10 w-full bg-slate-800/50 rounded-xl"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-80 bg-slate-800/50 rounded-2xl"></div>
                <div className="h-4 w-32 bg-slate-800/30 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 w-full bg-slate-800/50 rounded-xl"></div>
                  <div className="h-10 w-full bg-slate-800/50 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl animate-pulse">
            <div className="h-8 w-48 bg-slate-800/50 rounded-xl mb-6"></div>
            <div className="h-96 bg-slate-800/50 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error UI
  if (errorMsg) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center">
          <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-slate-300 text-xl font-medium text-center max-w-md">
          {errorMsg}
        </p>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="py-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
            Create Invoice
          </h1>
          <p className="text-slate-400 mt-1 text-sm uppercase tracking-[0.18em]">
            Generate professional invoices for your events
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORM */}
        <form onSubmit={submit} className="space-y-8">
          {/* SHOP SELECT */}
          <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 hover:shadow-teal-500/20 hover:border-teal-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-teal-500/20 border border-teal-500/30">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-teal-400 transition"></div>
            </div>
            <label className="block text-slate-400 text-sm font-medium uppercase tracking-wide mb-4">
              Select Shop
            </label>
            <select
              value={selectedShopId}
              onChange={(e) => setSelectedShopId(e.target.value)}
              className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 text-slate-100 placeholder-slate-500 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all duration-300"
              required
            >
              <option value="">-- Select Shop --</option>
              {shops.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* CUSTOMER & EVENT INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/30">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-blue-400 transition"></div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">Customer Name</label>
                  <input
                    className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 text-slate-100 placeholder-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">Phone</label>
                  <input
                    className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 text-slate-100 placeholder-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-emerald-400 transition"></div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">Event Date</label>
                  <input
                    type="date"
                    className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 text-slate-100 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">Event Time</label>
                  <input
                    className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 text-slate-100 placeholder-slate-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="10:00 AM"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-100 mb-1">Items</h3>
                <p className="text-slate-400 text-sm">Add items and quantities</p>
              </div>
              <div className="w-2 h-12 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full shadow-lg"></div>
            </div>

            <div className="space-y-4 mb-6">
              {items.map((it, i) => (
                <div
                  key={i}
                  className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300"
                >
                  <div className="grid grid-cols-12 gap-3 items-end">
                    <input
                      className="col-span-5 bg-slate-900/50 backdrop-blur-xl border border-slate-700/30 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
                      placeholder="Item name"
                      value={it.name}
                      onChange={(e) => updateItem(i, "name", e.target.value)}
                      required
                    />

                    <input
                      className="col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-700/30 rounded-xl p-3 text-slate-100 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={it.qty}
                      onChange={(e) => updateItem(i, "qty", e.target.value)}
                      required
                    />

                    <input
                      className="col-span-3 bg-slate-900/50 backdrop-blur-xl border border-slate-700/30 rounded-xl p-3 text-slate-100 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="₹ Price"
                      value={it.price}
                      onChange={(e) => updateItem(i, "price", e.target.value)}
                      required
                    />

                    <button
                      type="button"
                      className="col-span-2 bg-gradient-to-r from-red-500/90 to-red-600/90 backdrop-blur-xl text-white font-medium py-2 px-3 rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/25 transition-all duration-300 border border-red-500/30"
                      onClick={() => removeItem(i)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addItem}
                className="group w-full bg-gradient-to-r from-emerald-500/90 to-teal-500/90 backdrop-blur-xl text-white font-semibold py-4 px-6 rounded-2xl hover:from-emerald-600 hover:to-teal-600 shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 border border-emerald-500/30 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Item
              </button>
            </div>

            {/* FINANCIALS */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800/50">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-3">Discount</label>
                <input
                  type="number"
                  className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 text-slate-100 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-medium mb-3">Subtotal</label>
                <div className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 text-slate-100 font-bold text-2xl text-right">
                  ₹{subtotal.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-3">Total Amount</label>
                <div className="w-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 text-slate-100 font-black text-3xl text-right shadow-inner">
                  ₹{totalAmount.toLocaleString()}
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-3">Amount in Words</label>
                <div className="w-full bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-4 text-slate-200 font-medium text-lg">
                  {amountInWords || "Zero rupees"}
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT & NOTES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/30">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-purple-400 transition"></div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">Payment Method</label>
                  <select
                    className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 text-slate-100 placeholder-slate-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">💰 Cash</option>
                    <option value="upi">📱 UPI</option>
                    <option value="card">💳 Card</option>
                    <option value="bank">🏦 Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">Notes</label>
                  <textarea
                    className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 text-slate-100 placeholder-slate-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-vertical"
                    rows="4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes or special instructions..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit"
            className="group w-full bg-gradient-to-r from-teal-500/90 to-emerald-500/90 backdrop-blur-xl text-white font-black text-xl py-8 px-8 rounded-3xl hover:from-teal-600 hover:to-emerald-600 shadow-2xl hover:shadow-teal-500/30 transition-all duration-500 border border-teal-500/40 flex items-center justify-center gap-3"
          >
            <svg className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Create Invoice
          </button>
        </form>

        {/* PREVIEW */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-1">
                Invoice Preview
              </h2>
              <p className="text-slate-400 text-sm">
                Real-time preview of your invoice
              </p>
            </div>
            <div className="w-2 h-12 bg-gradient-to-b from-blue-500 to-emerald-400 rounded-full shadow-lg"></div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 h-[calc(100vh-12rem)] overflow-auto">
            <InvoicePreview
              shop={selectedShop}
              invoice={{
                customerName,
                customerPhone,
                paymentMethod,
                notes,
                eventDate,
                eventPlace,
                eventTime,
                eventType,
                items,
                subtotal,
                discount,
                totalAmount,
                amountInWords,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
