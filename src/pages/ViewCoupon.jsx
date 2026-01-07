import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/api";
import { FaEdit, FaTrash, FaDownload, FaCopy, FaShare, FaExternalLinkAlt } from "react-icons/fa";

export default function ViewCoupon() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    expiryDate: "",
  });
  const [copied, setCopied] = useState(false);


  const backendBase = useMemo(() => {
    return (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace("/api", "");
  }, []);


  const frontendBase = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";
  const publicScanLink = template ? `${frontendBase}/scan/${template.templateCode}` : "";


  useEffect(() => {
    API.get(`/coupons/template/${id}`)
      .then((res) => {
        setTemplate(res.data.template);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl p-12 animate-pulse">
          <div className="h-12 bg-slate-800/50 rounded-2xl w-96 mx-auto mb-8"></div>
          <div className="h-6 bg-slate-800/30 rounded-xl w-80 mx-auto mb-12"></div>
          <div className="flex justify-center gap-4">
            <div className="h-48 w-48 bg-slate-800/50 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-500/20 border-4 border-red-500/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-100 mb-2">Coupon Not Found</h2>
          <p className="text-slate-400 mb-8">The coupon template you're looking for doesn't exist.</p>
          <button
            className="
              bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black 
              px-8 py-4 rounded-3xl shadow-xl shadow-teal-500/40 hover:shadow-teal-500/60
              hover:scale-105 transition-all duration-300
            "
            onClick={() => navigate("/qrpages")}
          >
            Back to Coupons
          </button>
        </div>
      </div>
    );
  }

  const openModal = () => {
    setEditForm({
      title: template.title,
      description: template.description,
      expiryDate: template.expiryDate?.substring(0, 10),
    });
    setShowModal(true);
  };

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
    const imageUrl = template.qrImagePath;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${template.templateCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicScanLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const downloadPDF = async () => {
    const token = localStorage.getItem("token");
    const url = backendBase + `/api/coupons/download-pdf/${template._id}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Error downloading PDF");
        return;
      }

      const blob = await res.blob();
      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `${template.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
    } catch (err) {
      alert("Download failed");
    }
  };

  return (
    <div className="min-h-screen p-8 lg:p-12 space-y-12">
 
      <div className="flex items-start lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-100 via-teal-100 to-emerald-100 bg-clip-text text-transparent drop-shadow-2xl">
            {template.title}
          </h1>
          <p className="text-slate-400 mt-3 text-lg lg:text-xl max-w-2xl leading-relaxed">
            {template.description}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
          <button
            className="
              group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600
              text-white font-black px-8 py-4 rounded-3xl shadow-xl shadow-blue-500/40
              hover:shadow-blue-500/60 hover:scale-105 transition-all duration-300
            "
            onClick={openModal}
          >
            <FaEdit className="group-hover:rotate-12 transition-transform" />
            Update Details
          </button>
          <button
            className="
              group flex items-center gap-3 bg-gradient-to-r from-red-600 to-rose-600
              text-white font-black px-8 py-4 rounded-3xl shadow-xl shadow-red-500/40
              hover:shadow-red-500/60 hover:scale-105 transition-all duration-300
            "
            onClick={handleDelete}
          >
            <FaTrash className="group-hover:scale-110 transition-transform" />
            Delete Coupon
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
 
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-4xl shadow-2xl shadow-slate-950/50 p-8 lg:p-12">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-slate-100 mb-2 uppercase tracking-[0.1em]">
              Print Ready QR
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>

          {template.qrImagePath ? (
            <div className="relative group">
              <div className="p-8 bg-white/20 backdrop-blur-sm rounded-3xl border-8 border-white/50 shadow-2xl shadow-black/20 mx-auto max-w-xs">
                <img
                  src={template.qrImagePath}
                  alt="QR Code"
                  className="w-full h-auto rounded-2xl shadow-xl block mx-auto"
                />
              </div>
        
              <div className="flex flex-wrap gap-3 justify-center mt-8">
                <button
                  className="
                    group flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500
                    text-slate-950 font-bold px-6 py-3 rounded-2xl shadow-lg shadow-teal-500/40
                    hover:shadow-teal-500/60 hover:scale-105 transition-all duration-300
                  "
                  onClick={downloadQR}
                >
                  <FaDownload />
                  PNG
                </button>
                <button
                  className="
                    group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600
                    text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-indigo-500/40
                    hover:shadow-indigo-500/60 hover:scale-105 transition-all duration-300
                  "
                  onClick={downloadPDF}
                >
                  <FaDownload />
                  PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 bg-slate-800/50 border-4 border-dashed border-slate-700/50 rounded-3xl">
              <svg className="w-20 h-20 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-slate-400 text-lg font-semibold mb-2">No QR Generated</p>
              <p className="text-slate-500 text-sm">QR code will be available after template creation</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/60 rounded-3xl p-8">
            <h3 className="text-xl font-black text-slate-100 mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
              Validity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl">
                <span className="text-slate-300 font-semibold">Expires</span>
                <span className="font-mono text-slate-100 font-bold text-lg">
                  {template.expiryDate?.substring(0, 10) || "No expiry"}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl">
                <span className="text-slate-300 font-semibold">Template Code</span>
                <code className="font-mono text-teal-400 font-bold text-lg bg-teal-500/20 px-3 py-1 rounded-xl">
                  {template.templateCode}
                </code>
              </div>
            </div>
          </div>

      
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/60 rounded-3xl p-8">
            <h3 className="text-xl font-black text-slate-100 mb-6 flex items-center gap-3">
              <FaExternalLinkAlt className="text-blue-400" />
              Public Scan Link
            </h3>
            
            <div className="relative group">
              <div className="relative">
                <input
                  type="text"
                  className="
                    w-full p-5 pl-14 pr-14 bg-slate-800/70 border border-slate-700/80
                    rounded-3xl backdrop-blur-sm text-slate-100 font-mono text-sm
                    focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500/60
                    cursor-pointer select-all transition-all shadow-xl hover:shadow-blue-500/20
                  "
                  value={publicScanLink}
                  readOnly
                />
                <FaShare className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-hover:text-blue-400 transition-colors" />
                <button
                  className="
                    absolute right-4 top-1/2 -translate-y-1/2 p-2
                    bg-slate-700/50 hover:bg-blue-600/80 text-slate-300 hover:text-blue-100
                    rounded-2xl shadow-md hover:shadow-blue-500/40 hover:scale-110
                    transition-all duration-300
                  "
                  onClick={copyLink}
                  title="Copy Link"
                >
                  {copied ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <FaCopy className="w-4 h-4" />
                  )}
                </button>
              </div>
              {copied && (
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs shadow-lg whitespace-nowrap">
                  Copied!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

   
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-slate-950/50 w-full max-w-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-100 flex items-center gap-3">
                <FaEdit className="text-blue-400" />
                Update Coupon Details
              </h2>
              <button
                className="p-2 hover:bg-slate-800/50 rounded-2xl text-slate-400 hover:text-slate-200"
                onClick={() => setShowModal(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="
                    w-full p-5 bg-slate-800/50 border border-slate-700/80 rounded-3xl
                    text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50
                    transition-all shadow-md hover:shadow-blue-500/20
                  "
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  rows="4"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="
                    w-full p-5 bg-slate-800/50 border border-slate-700/80 rounded-3xl
                    text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50
                    resize-vertical transition-all shadow-md hover:shadow-blue-500/20
                  "
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={editForm.expiryDate}
                  onChange={(e) => setEditForm({ ...editForm, expiryDate: e.target.value })}
                  className="
                    w-full p-5 bg-slate-800/50 border border-slate-700/80 rounded-3xl
                    text-slate-100 focus:ring-2 focus:ring-blue-500/50 transition-all
                    shadow-md hover:shadow-blue-500/20
                  "
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-700/50">
                <button
                  type="button"
                  className="
                    px-8 py-4 bg-slate-700/50 border border-slate-700 text-slate-300
                    rounded-3xl hover:bg-slate-700 hover:text-slate-100 transition-all
                    font-semibold hover:shadow-lg
                  "
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="
                    px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                    rounded-3xl shadow-xl shadow-blue-500/40 hover:shadow-blue-500/60
                    hover:scale-105 transition-all font-black text-lg
                  "
                  onClick={handleUpdate}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
