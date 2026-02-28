// src/components/admin/AdminDashboard.js
import { useState, useEffect, useCallback } from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

const STATUSES = ["Processing","Confirmed","Shipped","Out for Delivery","Delivered","Cancelled"];

const STATUS_CONFIG = {
  "Processing":       { color:"#f59e0b", bg:"rgba(245,158,11,.15)",  icon:"⏳" },
  "Confirmed":        { color:"#3b82f6", bg:"rgba(59,130,246,.15)",  icon:"✅" },
  "Shipped":          { color:"#8b5cf6", bg:"rgba(139,92,246,.15)",  icon:"📦" },
  "Out for Delivery": { color:"#06b6d4", bg:"rgba(6,182,212,.15)",   icon:"🚚" },
  "Delivered":        { color:"#22c55e", bg:"rgba(34,197,94,.15)",   icon:"🎉" },
  "Cancelled":        { color:"#ef4444", bg:"rgba(239,68,68,.15)",   icon:"❌" },
};

export default function AdminDashboard({ adminName }) {
  const { user } = useUser();
  const [orders,    setOrders]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [updating,  setUpdating]  = useState({}); // { [orderId]: bool }
  const [updated,   setUpdated]   = useState({}); // { [orderId]: bool }
  const [localStatus, setLocalStatus] = useState({}); // edits before save
  const [localNote,   setLocalNote]   = useState({});
  const [search,    setSearch]    = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy,    setSortBy]    = useState("newest");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch orders");
      setOrders(data.orders);
      // Init local state from DB
      const statusMap = {}, noteMap = {};
      data.orders.forEach(o => {
        statusMap[o.orderId] = o.status;
        noteMap[o.orderId] = o.adminNote || "";
      });
      setLocalStatus(statusMap);
      setLocalNote(noteMap);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleUpdate = async (orderId) => {
    setUpdating(p => ({ ...p, [orderId]: true }));
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: localStatus[orderId],
          adminNote: localNote[orderId],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Update local orders list
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, ...data.order } : o));
      setUpdated(p => ({ ...p, [orderId]: true }));
      setTimeout(() => setUpdated(p => ({ ...p, [orderId]: false })), 2500);
    } catch (e) {
      alert("Update failed: " + e.message);
    } finally {
      setUpdating(p => ({ ...p, [orderId]: false }));
    }
  };

  // Filter + sort
  const filtered = orders
    .filter(o => {
      const q = search.toLowerCase();
      const matchSearch = !q
        || o.orderId.toLowerCase().includes(q)
        || o.customerName.toLowerCase().includes(q)
        || o.product?.name?.toLowerCase().includes(q);
      const matchStatus = filterStatus === "all" || o.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  const stats = {
    total:     orders.length,
    processing: orders.filter(o => o.status === "Processing").length,
    shipped:    orders.filter(o => o.status === "Shipped").length,
    delivered:  orders.filter(o => o.status === "Delivered").length,
    revenue:    orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + (o.totalAmount || 0), 0),
  };

  const BRAND = "#E8391D";

  return (
    <div style={{ minHeight:"100vh", background:"#0D0D0D", color:"#E5E5E5", fontFamily:"'DM Sans',sans-serif", display:"flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing:border-box; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#1a1a1a} ::-webkit-scrollbar-thumb{background:#E8391D;border-radius:2px}
        .stat-card { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:16px; padding:1.2rem 1.4rem; transition:all .25s; }
        .stat-card:hover { background:rgba(255,255,255,.07); border-color:rgba(232,57,29,.3); transform:translateY(-2px); }
        .trow { border-bottom:1px solid rgba(255,255,255,.06); transition:background .15s; }
        .trow:hover { background:rgba(255,255,255,.03); }
        .stbadge { display:inline-flex; align-items:center; gap:.35rem; padding:.25rem .7rem; border-radius:50px; font-size:.7rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; }
        .sel { background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12); color:#E5E5E5; padding:.5rem .8rem; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:.82rem; cursor:pointer; outline:none; transition:border-color .2s; }
        .sel:focus { border-color:${BRAND}; }
        .upd-btn { padding:.5rem 1.1rem; border-radius:8px; border:none; font-family:'DM Sans',sans-serif; font-weight:700; font-size:.8rem; cursor:pointer; transition:all .25s; letter-spacing:.04em; }
        .upd-btn.normal { background:linear-gradient(135deg,${BRAND},#C42E15); color:#fff; box-shadow:0 4px 16px rgba(232,57,29,.35); }
        .upd-btn.normal:hover { box-shadow:0 6px 24px rgba(232,57,29,.55); transform:translateY(-1px); }
        .upd-btn.done { background:linear-gradient(135deg,#22c55e,#16a34a); color:#fff; }
        .upd-btn.loading { background:rgba(255,255,255,.1); color:#999; cursor:not-allowed; }
        .search-inp { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); color:#E5E5E5; padding:.6rem 1rem .6rem 2.4rem; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:.88rem; width:100%; max-width:280px; outline:none; transition:border-color .2s; }
        .search-inp:focus { border-color:${BRAND}; }
        .search-inp::placeholder { color:rgba(255,255,255,.3); }
        .admin-note { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); color:#ccc; padding:.35rem .7rem; border-radius:7px; font-family:'DM Sans',sans-serif; font-size:.75rem; width:150px; outline:none; transition:border-color .2s; }
        .admin-note:focus { border-color:${BRAND}; }
        .sidebar-link { display:flex; align-items:center; gap:.7rem; padding:.7rem 1rem; border-radius:10px; color:rgba(255,255,255,.55); font-size:.88rem; font-weight:600; cursor:pointer; transition:all .2s; text-decoration:none; background:none; border:none; font-family:'DM Sans',sans-serif; width:100%; }
        .sidebar-link:hover { color:#fff; background:rgba(255,255,255,.07); }
        .sidebar-link.active { color:#fff; background:rgba(232,57,29,.18); border:1px solid rgba(232,57,29,.3); }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .skeleton { background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%); background-size:400px 100%; animation:shimmer 1.5s infinite; border-radius:6px; }
        @media(max-width:900px){.admin-table thead .hide-mob{display:none}.admin-table tbody .hide-mob{display:none}}
      `}</style>

      {/* ════════ SIDEBAR ════════ */}
      <aside style={{
        width:220, background:"#111", borderRight:"1px solid rgba(255,255,255,.07)",
        display:"flex", flexDirection:"column", padding:"1.5rem 1rem",
        position:"fixed", top:0, bottom:0, left:0, zIndex:100,
        overflowY:"auto",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration:"none", marginBottom:"2rem", display:"block" }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"1.3rem", fontWeight:700, letterSpacing:".06em", color:"#fff" }}>
            POPPY<span style={{ color:BRAND }}>PINK</span>
          </div>
          <div style={{ fontSize:".65rem", color:"rgba(255,255,255,.3)", letterSpacing:".1em", textTransform:"uppercase", marginTop:".1rem" }}>Admin Panel</div>
        </Link>

        <nav style={{ display:"flex", flexDirection:"column", gap:".3rem", flex:1 }}>
          <button className="sidebar-link active">📊 Dashboard</button>
          <button className="sidebar-link" onClick={fetchOrders}>🔄 Refresh Orders</button>
          <Link href="/track" className="sidebar-link">📦 Track Order</Link>
          <Link href="/" className="sidebar-link">🛍️ View Store</Link>
        </nav>

        {/* Admin user info */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:"1rem", marginTop:"1rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:".65rem", marginBottom:".75rem" }}>
            {user?.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.imageUrl} alt="Admin" style={{ width:32,height:32,borderRadius:"50%",border:`2px solid ${BRAND}` }}/>
            )}
            <div>
              <div style={{ fontSize:".8rem", fontWeight:600, color:"#fff", lineHeight:1.2 }}>{adminName}</div>
              <div style={{ fontSize:".65rem", color:BRAND, fontWeight:700 }}>ADMIN</div>
            </div>
          </div>
          <SignOutButton>
            <button className="sidebar-link" style={{ color:"#ef4444" }}>🚪 Sign Out</button>
          </SignOutButton>
        </div>
      </aside>

      {/* ════════ MAIN CONTENT ════════ */}
      <main style={{ marginLeft:220, flex:1, padding:"2rem 2rem 4rem", minWidth:0 }}>

        {/* Header */}
        <div style={{ marginBottom:"2rem" }}>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", fontWeight:700, color:"#fff", marginBottom:".3rem" }}>
            Order <span style={{ color:BRAND }}>Management</span>
          </h1>
          <p style={{ color:"rgba(255,255,255,.35)", fontSize:".85rem" }}>
            {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
          </p>
        </div>

        {/* ── Stats Row ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
          {[
            { label:"Total Orders",  value: stats.total,      icon:"📋", color:"#E5E5E5" },
            { label:"Processing",    value: stats.processing,  icon:"⏳", color:"#f59e0b" },
            { label:"Shipped",       value: stats.shipped,     icon:"📦", color:"#8b5cf6" },
            { label:"Delivered",     value: stats.delivered,   icon:"🎉", color:"#22c55e" },
            { label:"Revenue",       value:"₹" + stats.revenue.toLocaleString(), icon:"💰", color:BRAND },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize:"1.5rem", marginBottom:".4rem" }}>{s.icon}</div>
              <div style={{ fontSize:"1.6rem", fontWeight:800, color: s.color, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:".72rem", color:"rgba(255,255,255,.35)", fontWeight:600, textTransform:"uppercase", letterSpacing:".08em", marginTop:".25rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Filters Row ── */}
        <div style={{
          background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)",
          borderRadius:14, padding:"1rem 1.25rem", marginBottom:"1.5rem",
          display:"flex", gap:"1rem", flexWrap:"wrap", alignItems:"center",
        }}>
          {/* Search */}
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:".8rem", top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,.3)", fontSize:".88rem" }}>🔍</span>
            <input
              className="search-inp"
              placeholder="Search orders, customers…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <select className="sel" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Sort */}
          <select className="sel" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          <span style={{ marginLeft:"auto", color:"rgba(255,255,255,.3)", fontSize:".8rem" }}>
            {filtered.length} order{filtered.length !== 1 ? "s" : ""}
          </span>

          <button
            onClick={fetchOrders}
            style={{ background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)", color:"#fff", padding:".5rem .9rem", borderRadius:8, cursor:"pointer", fontSize:".8rem", fontWeight:600, fontFamily:"'DM Sans',sans-serif", transition:"all .2s" }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.3)", borderRadius:12, padding:"1rem 1.25rem", marginBottom:"1.5rem", color:"#fca5a5", fontSize:".88rem", display:"flex", alignItems:"center", gap:".6rem" }}>
            ⚠️ {error}
            <button onClick={fetchOrders} style={{ marginLeft:"auto", background:"rgba(239,68,68,.2)", border:"none", color:"#fca5a5", padding:".3rem .75rem", borderRadius:6, cursor:"pointer", fontSize:".78rem", fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>
              Retry
            </button>
          </div>
        )}

        {/* ── Loading Skeleton ── */}
        {loading && (
          <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:16, overflow:"hidden" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ display:"flex", gap:"1rem", padding:"1.1rem 1.25rem", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                {[80,120,100,80,120,80].map((w, j) => (
                  <div key={j} className="skeleton" style={{ height:16, width:w, flexShrink:0 }}/>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ── Orders Table ── */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div style={{ textAlign:"center", padding:"5rem 2rem", color:"rgba(255,255,255,.3)" }}>
                <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>📭</div>
                <p style={{ fontSize:"1rem" }}>{orders.length === 0 ? "No orders yet. They'll appear here once customers place orders." : "No orders match your filters."}</p>
              </div>
            ) : (
              <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.07)", borderRadius:16, overflow:"hidden" }}>
                {/* Responsive scroll wrapper */}
                <div style={{ overflowX:"auto" }}>
                  <table className="admin-table" style={{ width:"100%", borderCollapse:"collapse", minWidth:820 }}>
                    <thead>
                      <tr style={{ background:"rgba(255,255,255,.04)", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
                        {["Order ID","Customer","Product","Date","Amount","Status","Note","Action"].map(h => (
                          <th key={h} className={["Product","Date","Note"].includes(h) ? "hide-mob" : ""} style={{ padding:"1rem 1.1rem", textAlign:"left", fontSize:".72rem", fontWeight:700, color:"rgba(255,255,255,.4)", letterSpacing:".1em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(order => {
                        const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["Processing"];
                        const curStatus = localStatus[order.orderId] || order.status;
                        const curCfg = STATUS_CONFIG[curStatus] || cfg;
                        const isBusy = updating[order.orderId];
                        const isDone = updated[order.orderId];
                        const isDirty = localStatus[order.orderId] !== order.status || localNote[order.orderId] !== (order.adminNote || "");

                        return (
                          <tr key={order.orderId} className="trow">
                            {/* Order ID */}
                            <td style={{ padding:".9rem 1.1rem" }}>
                              <span style={{ fontWeight:800, color:"#fff", fontSize:".85rem", fontFamily:"monospace", letterSpacing:".05em" }}>
                                {order.orderId}
                              </span>
                            </td>

                            {/* Customer */}
                            <td style={{ padding:".9rem 1.1rem" }}>
                              <div style={{ fontWeight:600, color:"#E5E5E5", fontSize:".85rem" }}>{order.customerName}</div>
                              {order.customerPhone && <div style={{ color:"rgba(255,255,255,.3)", fontSize:".72rem" }}>{order.customerPhone}</div>}
                            </td>

                            {/* Product */}
                            <td className="hide-mob" style={{ padding:".9rem 1.1rem" }}>
                              <div style={{ fontSize:".82rem", color:"#ccc", maxWidth:160, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                                {order.product?.name}
                              </div>
                              <div style={{ fontSize:".7rem", color:"rgba(255,255,255,.3)" }}>
                                {order.product?.size && `Sz: ${order.product.size}`} {order.product?.qty > 1 && `× ${order.product.qty}`}
                              </div>
                            </td>

                            {/* Date */}
                            <td className="hide-mob" style={{ padding:".9rem 1.1rem" }}>
                              <div style={{ fontSize:".78rem", color:"rgba(255,255,255,.4)", whiteSpace:"nowrap" }}>
                                {new Date(order.createdAt).toLocaleDateString("en-IN",{ day:"numeric", month:"short", year:"2-digit" })}
                              </div>
                              <div style={{ fontSize:".7rem", color:"rgba(255,255,255,.25)" }}>
                                {new Date(order.createdAt).toLocaleTimeString("en-IN",{ hour:"2-digit", minute:"2-digit" })}
                              </div>
                            </td>

                            {/* Amount */}
                            <td style={{ padding:".9rem 1.1rem" }}>
                              <span style={{ fontWeight:800, color:BRAND, fontSize:".9rem" }}>₹{order.totalAmount?.toLocaleString()}</span>
                            </td>

                            {/* Status dropdown */}
                            <td style={{ padding:".9rem 1.1rem" }}>
                              <div style={{ display:"flex", flexDirection:"column", gap:".4rem" }}>
                                <span className="stbadge" style={{ color:curCfg.color, background:curCfg.bg }}>
                                  {curCfg.icon} {curStatus}
                                </span>
                                <select
                                  className="sel"
                                  value={curStatus}
                                  onChange={e => setLocalStatus(p => ({ ...p, [order.orderId]: e.target.value }))}
                                  style={{ fontSize:".75rem", padding:".35rem .6rem" }}
                                >
                                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </div>
                            </td>

                            {/* Admin note */}
                            <td className="hide-mob" style={{ padding:".9rem 1.1rem" }}>
                              <input
                                className="admin-note"
                                placeholder="Add note…"
                                value={localNote[order.orderId] ?? ""}
                                onChange={e => setLocalNote(p => ({ ...p, [order.orderId]: e.target.value }))}
                              />
                            </td>

                            {/* Update button */}
                            <td style={{ padding:".9rem 1.1rem" }}>
                              <button
                                className={`upd-btn ${isBusy ? "loading" : isDone ? "done" : "normal"}`}
                                onClick={() => handleUpdate(order.orderId)}
                                disabled={isBusy}
                              >
                                {isBusy ? "…" : isDone ? "✓ Saved" : isDirty ? "💾 Save*" : "💾 Save"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer note */}
        <p style={{ marginTop:"2rem", color:"rgba(255,255,255,.18)", fontSize:".75rem", textAlign:"center" }}>
          POPPYPINK Admin Panel · {orders.length} total orders · Changes auto-save to MongoDB
        </p>
      </main>
    </div>
  );
}
