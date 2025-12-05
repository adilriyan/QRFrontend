import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/api";

export default function ViewCoupon() {
  const { id } = useParams(); // templateId (MongoDB _id)
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    expiryDate: "",
  });

  // Backend base URL (cleaned)
  const backendBase = useMemo(() => {
    return (import.meta.env.VITE_API_BASE || "http://localhost:5000")
      .replace("/api", "");
  }, []);

  // Frontend Scan URL
  const frontendBase =
    import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";

  // Fetch template
  useEffect(() => {
    API.get(`/coupons/template/${id}`)
      .then((res) => {
        setTemplate(res.data.template);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6 text-white">Loading...</p>;
  if (!template) return <p className="p-6 text-red-500">Template not found</p>;

  const publicScanLink = `${frontendBase}/scan/${template.templateCode}`;

  // Open modal & preload values
  const openModal = () => {
    setEditForm({
      title: template.title,
      description: template.description,
      expiryDate: template.expiryDate?.substring(0, 10),
    });
    setShowModal(true);
  };

  // Update template
  const handleUpdate = async () => {
    try {
      const res = await API.put(`/coupons/update/${id}`, editForm);
      alert("Coupon Updated Successfully!");
      setTemplate(res.data.template);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // Delete template
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await API.delete(`/coupons/delete/${id}`);
      alert("Template deleted");
      navigate("/qrpages");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

const downloadQR = () => {
  const token = localStorage.getItem("token");
  const url = backendBase + `/api/coupons/download-qr/${template._id}`;

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.blob();
    })
    .then((blob) => {
      // Create a temporary URL for the blob
      const fileURL = URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger the download
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `${template.templateCode || 'qr-code'}.png`; // Dynamic filename based on template code
      document.body.appendChild(link); // Append to DOM for compatibility
      link.click(); // Trigger the download
      document.body.removeChild(link); // Clean up

      // Revoke the object URL to free memory
      URL.revokeObjectURL(fileURL);
    })
    .catch((error) => {
      console.error('Download failed:', error);
      // Optionally, show a user-friendly error message, e.g., alert('Failed to download QR code.');
    });
};



  // Download PDF
 const downloadPDF = () => {
  const token = localStorage.getItem("token");

  const url = backendBase + `/api/coupons/download-pdf/${template._id}`;

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Error downloading PDF");
        return;
      }

      const blob = await res.blob();
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
    })
    .catch(() => alert("Something went wrong"));
};



  return (
    <div className="space-y-8">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-white drop-shadow-lg">
        {template.title}
      </h1>

      {/* CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl">

        {/* DESCRIPTION */}
        <p className="text-gray-700 mb-4 text-lg">{template.description}</p>

        {/* EXPIRY */}
        <p className="text-gray-500 mb-6">
          <span className="font-medium">Expiry:</span>{" "}
          {template.expiryDate?.substring(0, 10)}
        </p>

        {/* QR IMAGE */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            QR Code (For Printing)
          </h3>

          {template.qrImagePath ? (
            <>
              <img
                src={backendBase + template.qrImagePath}
                alt="QR"
                className="w-48 border-2 border-gray-200 p-4 rounded-xl bg-gray-50 shadow-md"
              />

              {/* DOWNLOAD QR */}
              <button
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700"
                onClick={downloadQR}
              >
                Download QR (PNG)
              </button>
            </>
          ) : (
            <p className="text-gray-500">No QR generated</p>
          )}
        </div>

        {/* PUBLIC SCAN LINK */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            Public Scan Link
          </h3>

          <code className="block bg-gray-100 p-4 mt-2 rounded-xl text-sm break-all border">
            {publicScanLink}
          </code>

          <button
            className="mt-4 bg-teal-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
            onClick={() => navigator.clipboard.writeText(publicScanLink)}
          >
            Copy Link
          </button>
        </div>

        {/* DOWNLOAD PDF */}
        <div className="mt-8">
          <button
            className="bg-teal-600 text-white px-6 py-3 rounded-xl shadow hover:bg-teal-700"
            onClick={downloadPDF}
          >
            Download Coupon (PDF)
          </button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-8 flex space-x-4">
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-600"
            onClick={openModal}
          >
            Update Coupon
          </button>

          <button
            className="bg-red-500 text-white px-6 py-3 rounded-xl shadow hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete Coupon
          </button>
        </div>
      </div>

      {/* UPDATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">

            <h2 className="text-xl font-bold mb-4">Update Coupon</h2>

            <label className="block mb-2">Title</label>
            <input
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              className="p-2 border rounded w-full mb-3"
            />

            <label className="block mb-2">Description</label>
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              className="p-2 border rounded w-full mb-3"
              rows="3"
            />

            <label className="block mb-2">Expiry Date</label>
            <input
              type="date"
              value={editForm.expiryDate}
              onChange={(e) =>
                setEditForm({ ...editForm, expiryDate: e.target.value })
              }
              className="p-2 border rounded w-full mb-4"
            />

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
