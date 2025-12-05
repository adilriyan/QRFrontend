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
      ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) +
        " hundred "
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

  // Load shops
  useEffect(() => {
    API.get("/shops/all")
      .then((res) => setShops(res.data.shops || []))
      .catch(() => setErrorMsg("Failed to load shops."));
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

  return (
    <div className="py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* FORM */}
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-xl shadow space-y-5"
      >
        <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>

        {errorMsg && (
          <p className="text-red-500 mb-3">{errorMsg}</p>
        )}

        {/* SHOP SELECT */}
        <div>
          <label className="font-semibold">Select Shop</label>
          <select
            value={selectedShopId}
            onChange={(e) => setSelectedShopId(e.target.value)}
            className="w-full p-2 border rounded mt-1"
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

        {/* CUSTOMER INFO */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label>Customer Name</label>
            <input
              className="w-full p-2 border rounded"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Phone</label>
            <input
              className="w-full p-2 border rounded"
              value={customerPhone}
              onChange={(e) =>
                setCustomerPhone(e.target.value)
              }
            />
          </div>
        </div>

        {/* EVENT DETAILS */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label>Event Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>

          <div>
            <label>Event Time</label>
            <input
              className="w-full p-2 border rounded"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label>Event Place</label>
            <input
              className="w-full p-2 border rounded"
              value={eventPlace}
              onChange={(e) => setEventPlace(e.target.value)}
            />
          </div>

          <div>
            <label>Event Type</label>
            <input
              className="w-full p-2 border rounded"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            />
          </div>
        </div>

        {/* GUEST */}
        {/* <div>
          <label>Guest Count</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={guestCount}
            onChange={(e) =>
              setGuestCount(e.target.value)
            }
          />
        </div> */}

        {/* ITEMS */}
        <div>
          <label className="font-semibold block mb-2">
            Items
          </label>

          {items.map((it, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-2 mb-3 p-3 bg-gray-50 border rounded"
            >
              <input
                className="col-span-5 p-2 border rounded"
                placeholder="Item name"
                value={it.name}
                onChange={(e) =>
                  updateItem(i, "name", e.target.value)
                }
                required
              />

              <input
                className="col-span-2 p-2 border rounded"
                type="number"
                min="1"
                value={it.qty}
                onChange={(e) =>
                  updateItem(i, "qty", e.target.value)
                }
                required
              />

              <input
                className="col-span-3 p-2 border rounded"
                type="number"
                min="0"
                value={it.price}
                onChange={(e) =>
                  updateItem(i, "price", e.target.value)
                }
                required
              />

              <button
                type="button"
                className="col-span-2 bg-red-500 text-white rounded"
                onClick={() => removeItem(i)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Item
          </button>
        </div>

        {/* FINANCIALS */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label>Discount</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>

          <div>
            <label>Total Amount</label>
            <input
              className="w-full p-2 border rounded bg-gray-100"
              value={totalAmount}
              readOnly
            />
          </div>
        </div>

        {/* AMOUNT IN WORDS */}
        <div>
          <label>Amount In Words</label>
          <input
            className="w-full p-2 border rounded bg-gray-100"
            value={amountInWords}
            readOnly
          />
        </div>

        {/* PAYMENT */}
        <div>
          <label>Payment Method</label>
          <select
            className="w-full p-2 border rounded"
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>

        {/* NOTES */}
        <div>
          <label>Notes / Description</label>
          <textarea
            className="w-full p-2 border rounded"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* SUBMIT */}
        <button className="bg-teal-600 text-white px-4 py-2 rounded w-full">
          Create Invoice
        </button>
      </form>

      {/* PREVIEW */}
      <div>
        <h2 className="text-xl font-semibold mb-3">
          Invoice Preview
        </h2>

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
  );
}
