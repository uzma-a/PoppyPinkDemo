// src/pages/admin/index.js
import { useEffect, useState, useCallback, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";

const BRAND = "#e55d6a";
const BRAND_DARK = "#c9404d";
const ADMIN_EMAILS = ["aasiauzma22@gmail.com"];; // 🔴 your admin email

const SIZE_OPTIONS = ["3", "4", "5", "6", "7", "8"];
const CATEGORY_OPTIONS = ["Heels", "Flats", "Sandals", "Wedges", "Boots", "Sneakers", "Loafers", "Mules", "Platforms", "Others"];
const STATUS_OPTIONS = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
const STATUS_COLORS = {
  Pending: { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  Confirmed: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  Shipped: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  Delivered: { bg: "#f0fdf4", color: "#14532d", border: "#86efac" },
  Cancelled: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
};

// ── Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Resize image before storing (max 800px, quality 0.82)
function resizeImage(base64, maxSize = 800) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > height) { if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; } }
      else { if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; } }
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.src = base64;
  });
}

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 20, padding: ".2rem .65rem", fontSize: ".72rem", fontWeight: 700 }}>{status}</span>;
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "1.4rem 1.6rem", border: "1.5px solid rgba(229,93,106,.1)", boxShadow: "0 4px 18px rgba(229,93,106,.06)", display: "flex", alignItems: "center", gap: "1.1rem" }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: color || "rgba(229,93,106,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>{icon}</div>
      <div>
        <div style={{ fontSize: ".78rem", color: "#999", fontWeight: 600, marginBottom: ".15rem" }}>{label}</div>
        <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#1a1a1a", lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: ".72rem", color: "#16a34a", fontWeight: 600, marginTop: ".2rem" }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// IMAGE UPLOAD COMPONENT
// ─────────────────────────────────────────────────────────────
function ImageUploader({ images, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const processFiles = async (files) => {
    const results = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const b64 = await fileToBase64(file);
      const resized = await resizeImage(b64);
      results.push(resized);
    }
    onChange([...images, ...results]);
  };

  const handleFiles = async (e) => {
    await processFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDrop = async (e) => {
    e.preventDefault(); setDragging(false);
    await processFiles(Array.from(e.dataTransfer.files));
  };

  const removeImage = (i) => onChange(images.filter((_, j) => j !== i));
  const setThumbnail = (i) => {
    if (i === 0) return;
    const arr = [...images];
    [arr[0], arr[i]] = [arr[i], arr[0]];
    onChange(arr);
  };

  return (
    <div>
      {/* Thumbnail + gallery row */}
      {images.length > 0 && (
        <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", marginBottom: ".75rem" }}>
          {images.map((src, i) => (
            <div key={i} style={{ position: "relative", flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`img-${i}`} style={{ width: i === 0 ? 120 : 72, height: i === 0 ? 120 : 72, objectFit: "cover", borderRadius: 12, border: i === 0 ? `3px solid ${BRAND}` : "2px solid rgba(229,93,106,.2)", transition: "all .2s" }} />
              {/* Thumbnail crown */}
              {i === 0 && (
                <span style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: BRAND, color: "#fff", fontSize: ".6rem", fontWeight: 800, padding: ".1rem .4rem", borderRadius: 20, whiteSpace: "nowrap" }}>THUMBNAIL</span>
              )}
              {/* Set as thumbnail */}
              {i !== 0 && (
                <button type="button" onClick={() => setThumbnail(i)}
                  title="Set as thumbnail"
                  style={{ position: "absolute", bottom: 2, left: 2, background: "rgba(0,0,0,.6)", color: "#fff", border: "none", borderRadius: 6, fontSize: ".6rem", padding: ".15rem .3rem", cursor: "pointer", fontWeight: 700 }}>
                  ★
                </button>
              )}
              {/* Remove */}
              <button type="button" onClick={() => removeImage(i)}
                style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,.55)", color: "#fff", border: "none", borderRadius: "50%", width: 18, height: 18, fontSize: ".7rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, lineHeight: 1 }}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone / upload button */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{ border: `2px dashed ${dragging ? BRAND : "rgba(229,93,106,.3)"}`, borderRadius: 14, padding: "1.5rem", textAlign: "center", cursor: "pointer", background: dragging ? "rgba(229,93,106,.06)" : "#fdf9f9", transition: "all .2s" }}>
        <div style={{ fontSize: "1.8rem", marginBottom: ".4rem" }}>📷</div>
        <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: ".88rem", marginBottom: ".2rem" }}>
          {images.length === 0 ? "Upload product images" : "Add more images"}
        </div>
        <div style={{ fontSize: ".75rem", color: "#aaa" }}>Click to browse or drag & drop • JPG, PNG, WEBP</div>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleFiles} />
      </div>

      {images.length > 1 && (
        <p style={{ fontSize: ".72rem", color: "#aaa", marginTop: ".4rem", textAlign: "center" }}>
          💡 Click ★ on any image to make it the thumbnail
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN ADMIN PAGE
// ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [tab, setTab] = useState("dashboard");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [products, setProducts] = useState([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const emptyForm = { name: "", category: "", price: "", offerPrice: "", sizes: [], images: [], colorOptions: [], badge: "" };
  const [form, setForm] = useState(emptyForm);
  const [formErr, setFormErr] = useState({});
  const [saving, setSaving] = useState(false);

  const isAdmin = isLoaded && user && ADMIN_EMAILS.includes(user.primaryEmailAddress?.emailAddress);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const r = await fetch("/api/orders");
      const d = await r.json();
      setOrders(d.orders || []);
    } catch (_) { }
    setOrdersLoading(false);
  }, []);

  const fetchProducts = useCallback(async () => {
    setProdLoading(true);
    try {
      const r = await fetch("/api/products");
      const d = await r.json();
      setProducts(d.products || []);
    } catch (_) { }
    setProdLoading(false);
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const r = await fetch("/api/admin/users");
      const d = await r.json();
      setUsers(d.users || []);
    } catch (_) { }
    setUsersLoading(false);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetchOrders();
    fetchProducts();
  }, [isAdmin, fetchOrders, fetchProducts]);

  useEffect(() => {
    if (tab === "users" && isAdmin && users.length === 0) fetchUsers();
  }, [tab, isAdmin, users.length, fetchUsers]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (_) { alert("Failed to update status"); }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm("Delete this order permanently?")) return;
    try {
      await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      setOrders(prev => prev.filter(o => o._id !== orderId));
    } catch (_) { alert("Failed to delete"); }
  };

  const openAdd = () => { setForm(emptyForm); setEditProduct(null); setFormErr({}); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, category: p.category, price: String(p.price), offerPrice: String(p.offerPrice), sizes: p.sizes || [], images: p.images || [], colorOptions: p.colorOptions || [], badge: p.badge || "" });
    setEditProduct(p); setFormErr({}); setShowForm(true);
  };

  const handleSave = async () => {
    const err = {};
    if (!form.name.trim()) err.name = "Required";
    if (!form.category) err.category = "Required";
    if (!form.price) err.price = "Required";
    if (!form.offerPrice) err.offerPrice = "Required";
    if (form.images.length === 0) err.images = "At least one image required";
    if (Object.keys(err).length) { setFormErr(err); return; }

    setSaving(true);
    try {
      const url = editProduct ? `/api/products/${editProduct._id}` : "/api/products";
      const method = editProduct ? "PUT" : "POST";
      const r = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price), offerPrice: Number(form.offerPrice) }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setShowForm(false);
      fetchProducts();
    } catch (e) { alert("Save failed: " + e.message); }
    setSaving(false);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try { await fetch(`/api/products/${id}`, { method: "DELETE" }); fetchProducts(); }
    catch (_) { alert("Delete failed"); }
  };

  const totalRevenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pendingCount = orders.filter(o => o.status === "Pending").length;
  const deliveredCount = orders.filter(o => o.status === "Delivered").length;

  if (!isLoaded) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ fontSize: "2rem" }}>⏳</div></div>;

  if (!isAdmin) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f9f9f9", textAlign: "center", padding: "2rem" }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚫</div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "2rem", color: "#1a1a1a", marginBottom: ".5rem" }}>Access Denied</h2>
      <p style={{ color: "#888", marginBottom: "2rem" }}>You don't have admin access.</p>
      <Link href="/" style={{ background: BRAND, color: "#fff", padding: ".75rem 2rem", borderRadius: 50, fontWeight: 700, textDecoration: "none" }}>← Back to Store</Link>
    </div>
  );

  const TABS = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "orders", label: "📦 Orders", count: orders.length },
    { id: "products", label: "👟 Products", count: products.length },
    { id: "users", label: "👥 Users" },
  ];

  return (
    <>
      <Head><title>Admin — POPPYPINK</title></Head>
      <style suppressHydrationWarning>{`
        * { box-sizing:border-box; }
        body { margin:0; font-family:'DM Sans',sans-serif; background:#f6f6f8; }
        .tab-btn { padding:.6rem 1.2rem;border-radius:50px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.84rem;font-weight:700;transition:all .2s;white-space:nowrap; }
        .tab-btn.active { background:${BRAND};color:#fff;box-shadow:0 4px 14px rgba(229,93,106,.35); }
        .tab-btn:not(.active) { background:#fff;color:#666;border:1.5px solid rgba(0,0,0,.08); }
        .tab-btn:not(.active):hover { border-color:${BRAND};color:${BRAND}; }
        .action-btn { padding:.45rem .9rem;border-radius:8px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:700;transition:all .2s; }
        .btn-primary { background:${BRAND};color:#fff; } .btn-primary:hover { background:${BRAND_DARK}; }
        .btn-danger  { background:#fef2f2;color:#dc2626;border:1px solid #fecaca!important; } .btn-danger:hover { background:#fee2e2; }
        .btn-edit    { background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe!important; } .btn-edit:hover { background:#dbeafe; }
        .data-table { width:100%;border-collapse:collapse;font-size:.84rem; }
        .data-table th { background:rgba(229,93,106,.06);color:#888;font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:.75rem 1rem;text-align:left;border-bottom:1.5px solid rgba(229,93,106,.1); }
        .data-table td { padding:.85rem 1rem;border-bottom:1px solid rgba(0,0,0,.05);vertical-align:middle;color:#1a1a1a; }
        .data-table tr:hover td { background:rgba(229,93,106,.025); }
        .form-input { width:100%;padding:.6rem .85rem;border:1.5px solid rgba(229,93,106,.22);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:.88rem;color:#1a1a1a;outline:none;transition:border-color .2s,box-shadow .2s;background:#fff; }
        .form-input:focus { border-color:${BRAND};box-shadow:0 0 0 3px rgba(229,93,106,.1); }
        .form-input.err { border-color:#dc2626; }
        .field-err { color:#dc2626;font-size:.7rem;margin-top:.2rem; }
        .overlay { position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem; }
        .modal { background:#fff;border-radius:20px;width:100%;max-width:580px;max-height:92vh;overflow-y:auto;padding:2rem;box-shadow:0 30px 80px rgba(0,0,0,.18); }
        .modal::-webkit-scrollbar{width:4px}.modal::-webkit-scrollbar-thumb{background:${BRAND};border-radius:2px}
        .size-chip { padding:.3rem .7rem;border-radius:8px;font-size:.78rem;font-weight:700;cursor:pointer;border:1.5px solid rgba(229,93,106,.25);transition:all .2s; }
        .size-chip.on  { background:${BRAND};color:#fff;border-color:${BRAND}; }
        .size-chip:not(.on) { background:#fff;color:#666; }
        .card { background:#fff;border-radius:16px;border:1.5px solid rgba(229,93,106,.1);box-shadow:0 4px 18px rgba(229,93,106,.06);overflow:hidden; }
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1.5px solid rgba(229,93,106,.12)", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(229,93,106,.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "1.3rem", color: BRAND }}>POPPYPINK</span>
          <span style={{ background: "rgba(229,93,106,.1)", color: BRAND, fontSize: ".65rem", fontWeight: 800, padding: ".2rem .55rem", borderRadius: 20, letterSpacing: ".1em" }}>ADMIN</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: ".85rem", color: "#888", fontWeight: 600 }}>👋 {user?.firstName || user?.primaryEmailAddress?.emailAddress}</span>
          <Link href="/" style={{ background: "rgba(229,93,106,.08)", color: BRAND, padding: ".4rem 1rem", borderRadius: 50, fontSize: ".8rem", fontWeight: 700, textDecoration: "none", border: `1px solid rgba(229,93,106,.2)` }}>← Store</Link>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: ".5rem", marginBottom: "2rem", overflowX: "auto", paddingBottom: ".25rem" }}>
          {TABS.map(t => (
            <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
              {t.count !== undefined && (
                <span style={{ marginLeft: ".4rem", background: tab === t.id ? "rgba(255,255,255,.25)" : "rgba(229,93,106,.12)", color: tab === t.id ? "#fff" : BRAND, borderRadius: 20, padding: ".05rem .45rem", fontSize: ".7rem" }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div style={{ animation: "fadeIn .3s ease" }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", color: "#1a1a1a", marginBottom: "1.5rem", fontWeight: 800 }}>Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
              <StatCard icon="💰" label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} sub="Excl. cancelled" color="rgba(34,197,94,.12)" />
              <StatCard icon="📦" label="Total Orders" value={orders.length} sub={`${pendingCount} pending`} color="rgba(59,130,246,.12)" />
              <StatCard icon="✅" label="Delivered" value={deliveredCount} sub="Successfully" color="rgba(16,185,129,.12)" />
              <StatCard icon="👟" label="Products" value={products.length} sub="Live in store" color="rgba(229,93,106,.12)" />
            </div>
            <div className="card">
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(229,93,106,.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", color: "#1a1a1a" }}>Recent Orders</h3>
                <button className="action-btn btn-primary" onClick={() => setTab("orders")}>View All →</button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o._id}>
                        <td><span style={{ fontFamily: "monospace", fontWeight: 700, color: BRAND }}>{o.orderId}</span></td>
                        <td>{o.customerName}</td>
                        <td><strong>₹{o.totalAmount?.toLocaleString()}</strong></td>
                        <td><StatusBadge status={o.status} /></td>
                        <td style={{ color: "#aaa", fontSize: ".8rem" }}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>No orders yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === "orders" && (
          <div style={{ animation: "fadeIn .3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: ".75rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", color: "#1a1a1a", margin: 0, fontWeight: 800 }}>
                Orders <span style={{ color: "#aaa", fontSize: "1rem", fontWeight: 500 }}>({orders.length})</span>
              </h2>
              <button className="action-btn btn-primary" onClick={fetchOrders}>🔄 Refresh</button>
            </div>
            {ordersLoading
              ? <div style={{ textAlign: "center", padding: "4rem", color: "#aaa" }}>Loading orders…</div>
              : <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {orders.map(o => (
                  <div key={o._id} className="card" style={{ overflow: "visible" }}>
                    <div style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: ".5rem", cursor: "pointer" }}
                      onClick={() => setExpandedOrder(expandedOrder === o._id ? null : o._id)}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "monospace", fontWeight: 800, color: BRAND, fontSize: ".95rem" }}>{o.orderId}</span>
                        <StatusBadge status={o.status || "Pending"} />
                        <span style={{ color: "#1a1a1a", fontWeight: 700 }}>{o.customerName}</span>
                        <span style={{ color: "#888", fontSize: ".82rem" }}>📱 {o.customerPhone}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                        <strong style={{ color: BRAND }}>₹{o.totalAmount?.toLocaleString()}</strong>
                        <span style={{ color: "#aaa", fontSize: ".8rem" }}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</span>
                        <span style={{ color: "#aaa" }}>{expandedOrder === o._id ? "▲" : "▼"}</span>
                      </div>
                    </div>
                    {expandedOrder === o._id && (
                      <div style={{ borderTop: "1px solid rgba(229,93,106,.1)", padding: "1.25rem 1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", background: "#fdf9f9", borderRadius: "0 0 16px 16px" }}>
                        <div>
                          <div style={{ fontSize: ".72rem", fontWeight: 800, color: "#aaa", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".6rem" }}>Product</div>
                          <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
                            {o.product?.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={o.product.image} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10, border: "1.5px solid rgba(229,93,106,.15)" }} />
                            )}
                            <div>
                              <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: ".9rem" }}>{o.product?.name}</div>
                              <div style={{ color: "#aaa", fontSize: ".78rem", marginTop: ".2rem" }}>Size: {o.product?.size || "N/A"} • Qty: {o.product?.qty} • ₹{o.product?.price?.toLocaleString()}</div>
                              <div style={{ color: "#888", fontSize: ".78rem" }}>Payment: <strong>{o.paymentMethod}</strong></div>
                            </div>
                          </div>
                          <div style={{ fontSize: ".72rem", fontWeight: 800, color: "#aaa", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".4rem" }}>Delivery Address</div>
                          <div style={{ fontSize: ".85rem", color: "#555", lineHeight: 1.7 }}>
                            {o.address?.line1}<br />{o.address?.city}, {o.address?.state} — {o.address?.pincode}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: ".72rem", fontWeight: 800, color: "#aaa", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".6rem" }}>Update Status</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: ".4rem", marginBottom: "1rem" }}>
                            {STATUS_OPTIONS.map(s => (
                              <button key={s} onClick={() => updateStatus(o._id, s)} style={{ padding: ".5rem 1rem", borderRadius: 10, border: "1.5px solid", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: ".82rem", textAlign: "left", background: o.status === s ? STATUS_COLORS[s]?.bg : "#fff", color: o.status === s ? STATUS_COLORS[s]?.color : "#666", borderColor: o.status === s ? STATUS_COLORS[s]?.border : "rgba(0,0,0,.1)", transition: "all .2s" }}>
                                {o.status === s ? "✓ " : ""}{s}
                              </button>
                            ))}
                          </div>
                          <button className="action-btn btn-danger" style={{ width: "100%" }} onClick={() => deleteOrder(o._id)}>🗑 Delete Order</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {orders.length === 0 && <div style={{ textAlign: "center", padding: "4rem", color: "#aaa", background: "#fff", borderRadius: 16 }}>No orders yet</div>}
              </div>
            }
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === "products" && (
          <div style={{ animation: "fadeIn .3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: ".75rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", color: "#1a1a1a", margin: 0, fontWeight: 800 }}>
                Products <span style={{ color: "#aaa", fontSize: "1rem", fontWeight: 500 }}>({products.length})</span>
              </h2>
              <button className="action-btn btn-primary" style={{ fontSize: ".88rem", padding: ".55rem 1.25rem" }} onClick={openAdd}>+ Add Product</button>
            </div>
            {prodLoading
              ? <div style={{ textAlign: "center", padding: "4rem", color: "#aaa" }}>Loading…</div>
              : <div className="card" style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>MRP</th><th>Offer</th><th>Sizes</th><th>Actions</th></tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td>
                          {p.images?.[0]
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={p.images[0]} alt={p.name} style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 10, border: "1.5px solid rgba(229,93,106,.15)" }} />
                            : <div style={{ width: 52, height: 52, borderRadius: 10, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>👟</div>
                          }
                        </td>
                        <td><strong style={{ fontSize: ".9rem" }}>{p.name}</strong></td>
                        <td><span style={{ background: "rgba(229,93,106,.08)", color: BRAND, padding: ".2rem .6rem", borderRadius: 20, fontSize: ".72rem", fontWeight: 700 }}>{p.category}</span></td>
                        <td style={{ color: "#aaa", textDecoration: "line-through" }}>₹{p.price?.toLocaleString()}</td>
                        <td><strong style={{ color: BRAND }}>₹{p.offerPrice?.toLocaleString()}</strong></td>
                        <td style={{ fontSize: ".78rem", color: "#666" }}>{p.sizes?.join(", ") || "—"}</td>
                        <td>
                          <div style={{ display: "flex", gap: ".4rem" }}>
                            <button className="action-btn btn-edit" onClick={() => openEdit(p)}>✏️ Edit</button>
                            <button className="action-btn btn-danger" onClick={() => handleDeleteProduct(p._id)}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "#aaa", padding: "3rem" }}>No products yet. Click "+ Add Product".</td></tr>}
                  </tbody>
                </table>
              </div>
            }
          </div>
        )}

        {/* ── USERS ── */}
        {tab === "users" && (
          <div style={{ animation: "fadeIn .3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: ".75rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", color: "#1a1a1a", margin: 0, fontWeight: 800 }}>
                Users <span style={{ color: "#aaa", fontSize: "1rem", fontWeight: 500 }}>({users.length})</span>
              </h2>
              <button className="action-btn btn-primary" onClick={fetchUsers}>🔄 Refresh</button>
            </div>
            {usersLoading
              ? <div style={{ textAlign: "center", padding: "4rem", color: "#aaa" }}>Loading…</div>
              : <div className="card" style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead><tr><th>Avatar</th><th>Name</th><th>Email</th><th>Joined</th><th>Sign-in</th></tr></thead>
                  <tbody>
                    {users.map(u => {
                      const firstName = u.first_name || "";
                      const lastName = u.last_name || "";
                      const email = u.email_addresses?.[0]?.email_address || "—";
                      const imageUrl = u.image_url || "";
                      const createdAt = u.created_at || null;
                      const external = u.external_accounts || [];
                      const initials = (firstName?.[0] || email?.[0] || "?").toUpperCase();
                      return (
                        <tr key={u.id}>
                          <td>
                            {imageUrl
                              ? <img src={imageUrl} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: `2px solid rgba(229,93,106,.2)` }} />
                              : <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(229,93,106,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: BRAND }}>
                                {initials}
                              </div>
                            }
                          </td>
                          <td><strong>{firstName} {lastName}</strong></td>
                          <td style={{ color: "#666", fontSize: ".85rem" }}>{email}</td>
                          <td style={{ color: "#aaa", fontSize: ".8rem" }}>{createdAt ? new Date(createdAt).toLocaleDateString("en-IN") : "—"}</td>
                          <td>
                            {external.map(a => (
                              <span key={a.provider} style={{ background: "#f0f0f0", color: "#555", padding: ".2rem .5rem", borderRadius: 20, fontSize: ".7rem", fontWeight: 700, marginRight: ".3rem" }}>{a.provider}</span>
                            ))}
                            {external.length === 0 && (
                              <span style={{ background: "rgba(229,93,106,.08)", color: BRAND, padding: ".2rem .5rem", borderRadius: 20, fontSize: ".7rem", fontWeight: 700 }}>Email</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {users.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "#aaa", padding: "3rem" }}>No users found.</td></tr>}
                  </tbody>
                </table>
              </div>
            }
          </div>
        )}
      </div>

      {/* ── ADD / EDIT PRODUCT MODAL ── */}
      {showForm && (
        <div className="overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", color: "#1a1a1a", margin: 0 }}>
                {editProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "1.4rem", lineHeight: 1 }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Images */}
              <div>
                <label style={{ fontSize: ".8rem", fontWeight: 700, color: "#1a1a1a", display: "block", marginBottom: ".5rem" }}>
                  Product Images * <span style={{ color: "#aaa", fontWeight: 400 }}>(first = thumbnail)</span>
                </label>
                {formErr.images && <div className="field-err" style={{ marginBottom: ".4rem" }}>{formErr.images}</div>}
                <ImageUploader
                  images={form.images}
                  onChange={imgs => { setForm(p => ({ ...p, images: imgs })); setFormErr(p => ({ ...p, images: "" })); }}
                />
              </div>

              {/* Name */}
              <div>
                <label style={{ fontSize: ".8rem", fontWeight: 700, color: "#1a1a1a", display: "block", marginBottom: ".3rem" }}>Product Name *</label>
                <input className={`form-input ${formErr.name ? "err" : ""}`} placeholder="e.g. Women Embellished Heels"
                  value={form.name} onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setFormErr(p => ({ ...p, name: "" })); }} />
                {formErr.name && <div className="field-err">{formErr.name}</div>}
              </div>

              {/* Category */}
              <div>
                <label style={{ fontSize: ".8rem", fontWeight: 700, color: "#1a1a1a", display: "block", marginBottom: ".3rem" }}>Category *</label>
                <select className={`form-input ${formErr.category ? "err" : ""}`}
                  value={form.category} onChange={e => { setForm(p => ({ ...p, category: e.target.value })); setFormErr(p => ({ ...p, category: "" })); }}>
                  <option value="">Select category…</option>
                  {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {formErr.category && <div className="field-err">{formErr.category}</div>}
              </div>

              {/* Price row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
                <div>
                  <label style={{ fontSize: ".8rem", fontWeight: 700, color: "#1a1a1a", display: "block", marginBottom: ".3rem" }}>MRP (₹) *</label>
                  <input className={`form-input ${formErr.price ? "err" : ""}`} type="number" placeholder="2000"
                    value={form.price} onChange={e => { setForm(p => ({ ...p, price: e.target.value })); setFormErr(p => ({ ...p, price: "" })); }} />
                  {formErr.price && <div className="field-err">{formErr.price}</div>}
                </div>
                <div>
                  <label style={{ fontSize: ".8rem", fontWeight: 700, color: "#1a1a1a", display: "block", marginBottom: ".3rem" }}>Offer Price (₹) *</label>
                  <input className={`form-input ${formErr.offerPrice ? "err" : ""}`} type="number" placeholder="1324"
                    value={form.offerPrice} onChange={e => { setForm(p => ({ ...p, offerPrice: e.target.value })); setFormErr(p => ({ ...p, offerPrice: "" })); }} />
                  {formErr.offerPrice && <div className="field-err">{formErr.offerPrice}</div>}
                </div>
              </div>

              {/* Badge */}
              <div>
                <label style={{ fontSize: ".8rem", fontWeight: 700, color: "#1a1a1a", display: "block", marginBottom: ".3rem" }}>Badge <span style={{ color: "#aaa", fontWeight: 400 }}>(optional)</span></label>
                <input className="form-input" placeholder="e.g. BESTSELLER, NEW, HOT"
                  value={form.badge} onChange={e => setForm(p => ({ ...p, badge: e.target.value }))} />
              </div>

              {/* Sizes */}
              <div>
                <label style={{ fontSize: ".8rem", fontWeight: 700, color: "#1a1a1a", display: "block", marginBottom: ".5rem" }}>Sizes (UK)</label>
                <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                  {SIZE_OPTIONS.map(s => (
                    <button key={s} type="button" className={`size-chip ${form.sizes.includes(s) ? "on" : ""}`}
                      onClick={() => setForm(p => ({ ...p, sizes: p.sizes.includes(s) ? p.sizes.filter(x => x !== s) : [...p.sizes, s] }))}>
                      UK {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color options */}
              <div>
                <label style={{ fontSize: ".8rem", fontWeight: 700, color: "#1a1a1a", display: "block", marginBottom: ".4rem" }}>
                  Color Options <span style={{ color: "#aaa", fontWeight: 400 }}>(optional)</span>
                </label>
                {form.colorOptions.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: ".5rem", marginBottom: ".4rem", alignItems: "center" }}>
                    <input className="form-input" placeholder="Color name" value={c.name} style={{ flex: 2 }}
                      onChange={e => { const co = [...form.colorOptions]; co[i] = { ...co[i], name: e.target.value }; setForm(p => ({ ...p, colorOptions: co })); }} />
                    <input type="color" value={c.hex || "#e55d6a"} title="Pick color"
                      style={{ width: 40, height: 38, borderRadius: 8, border: "1.5px solid rgba(229,93,106,.2)", cursor: "pointer", padding: 2, flexShrink: 0 }}
                      onChange={e => { const co = [...form.colorOptions]; co[i] = { ...co[i], hex: e.target.value }; setForm(p => ({ ...p, colorOptions: co })); }} />
                    <button type="button" onClick={() => setForm(p => ({ ...p, colorOptions: p.colorOptions.filter((_, j) => j !== i) }))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "1.1rem", flexShrink: 0 }}>✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => setForm(p => ({ ...p, colorOptions: [...p.colorOptions, { name: "", hex: "#e55d6a" }] }))}
                  style={{ background: "rgba(229,93,106,.07)", border: "1.5px dashed rgba(229,93,106,.3)", color: BRAND, borderRadius: 10, padding: ".4rem 1rem", fontSize: ".8rem", fontWeight: 700, cursor: "pointer", width: "100%" }}>
                  + Add Color
                </button>
              </div>

              {/* Save button */}
              <button onClick={handleSave} disabled={saving}
                style={{ width: "100%", padding: "1rem", background: BRAND, color: "#fff", border: "none", borderRadius: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "1rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.65 : 1, marginTop: ".5rem", boxShadow: "0 8px 24px rgba(229,93,106,.3)", transition: "all .3s" }}>
                {saving
                  ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem" }}>
                    <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.35)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite", display: "inline-block" }} />
                    Saving…
                  </span>
                  : editProduct ? "💾 Save Changes" : "✨ Add Product"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}