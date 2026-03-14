// src/pages/cart.js
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import { useRef, useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const BRAND = "#e55d6a";

const STATUS_STYLES = {
  pending:          { bg:"#fff7ed", color:"#ea580c", label:"⏳ Pending"         },
  processing:       { bg:"#eff6ff", color:"#2563eb", label:"🔄 Processing"      },
  confirmed:        { bg:"#f0fdf4", color:"#16a34a", label:"✅ Confirmed"        },
  shipped:          { bg:"#faf5ff", color:"#7c3aed", label:"🚚 Shipped"          },
  out_for_delivery: { bg:"#fff7ed", color:"#d97706", label:"🛵 Out for Delivery" },
  delivered:        { bg:"#f0fdf4", color:"#15803d", label:"📦 Delivered"        },
  cancelled:        { bg:"#fef2f2", color:"#dc2626", label:"❌ Cancelled"         },
};

export default function CartPage() {
  const footerRef = useRef(null);
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
  const { isSignedIn, user } = useUser();

  // ── My Orders
  const [myOrders,      setMyOrders]      = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeTab,     setActiveTab]     = useState("cart"); // "cart" | "orders"
  const [expandedOrder, setExpandedOrder] = useState(null);

  // ── Cart / checkout
  const [snapCart,      setSnapCart]      = useState([]);
  const [snapTotal,     setSnapTotal]     = useState(0);
  const [checkoutOpen,  setCheckoutOpen]  = useState(false);
  const [sending,       setSending]       = useState(false);
  const [sent,          setSent]          = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  const [form, setForm] = useState({
    name:"", phone:"", address:"", city:"", state:"", pincode:"",
    paymentMethod:"Online",
  });
  const [formErr, setFormErr] = useState({});

  // ── Fetch orders for logged-in user
  const fetchMyOrders = async () => {
    if (!user?.id) return;
    setOrdersLoading(true);
    try {
      const res  = await fetch(`/api/orders?userId=${user.id}`);
      const data = await res.json();
      setMyOrders(data.orders || []);
    } catch (_) {}
    setOrdersLoading(false);
  };

  useEffect(() => {
    if (isSignedIn && activeTab === "orders") fetchMyOrders();
  }, [isSignedIn, activeTab]);

  // Pre-fill name/phone from Clerk
  const handleOpenCheckout = () => {
    setForm(prev => ({
      ...prev,
      name:  prev.name  || user?.fullName || "",
      phone: prev.phone || user?.primaryPhoneNumber?.phoneNumber || "",
    }));
    setCheckoutOpen(true);
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim())                    err.name    = "Name required";
    if (!/^\d{10}$/.test(form.phone.trim()))  err.phone   = "Valid 10-digit number required";
    if (!form.address.trim())                 err.address = "Address required";
    if (!form.city.trim())                    err.city    = "City required";
    if (!form.state.trim())                   err.state   = "State required";
    if (!/^\d{6}$/.test(form.pincode.trim())) err.pincode = "Valid 6-digit pincode required";
    return err;
  };

  // ── called after Razorpay payment succeeds & order is saved
  const handlePaymentSuccess = async (newOrderId, customerEmail) => {
    const w3fKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (w3fKey && w3fKey !== "REPLACE_ME") {

      // Admin notification
      try {
        const itemsText = snapCart.length ? snapCart : cart;
        const lines = itemsText.map(i => {
          const colorName = i.selColor?.name || i.selColor || "—";
          const article   = i.article || "—";
          return `${i.name} | Article: ${article} | Color: ${colorName} | Size: ${i.size||"N/A"} | Qty: ${i.qty} | ₹${(i.offerPrice*i.qty).toLocaleString()}`;
        }).join("\n");

        const fd = new FormData();
        fd.append("access_key", w3fKey);
        fd.append("subject",   `🛒 Paid Order ${newOrderId} — POPPYPINK`);
        fd.append("from_name", "POPPYPINK Store");
        fd.append("message", [
          "━━━━━━━━━━━━━━━━━━━━━━━━━",
          "💳  PAID ORDER — POPPYPINK",
          "━━━━━━━━━━━━━━━━━━━━━━━━━",
          `Order ID : ${newOrderId}`,
          `Total    : ₹${total.toLocaleString()}`,
          `Payment  : Online (Razorpay) ✅`,
          `Items    : ${cart.length}`,
          "", "ITEMS:", lines, "",
          "📦 DELIVERY",
          "━━━━━━━━━━━━━━━━━━━━━━━━━",
          `Name    : ${form.name}`,
          `Phone   : ${form.phone}`,
          `Address : ${form.address}`,
          `City    : ${form.city}, ${form.state} - ${form.pincode}`,
          "", `Time    : ${new Date().toLocaleString("en-IN")}`,
        ].join("\n"));
        await fetch("https://api.web3forms.com/submit", { method:"POST", body:fd });
      } catch (_) {}

      // Customer confirmation email
      if (customerEmail) {
        try {
          const itemsForEmail = cart.map(i => {
            const colorName = i.selColor?.name || i.selColor || "—";
            const article   = i.article || "—";
            return `  • ${i.name}  |  Article: ${article}  |  Color: ${colorName}  |  Size: ${i.size||"N/A"}  |  Qty: ${i.qty}  →  ₹${(i.offerPrice*i.qty).toLocaleString()}`;
          }).join("\n");

          const fd2 = new FormData();
          fd2.append("access_key", w3fKey);
          fd2.append("to",         customerEmail);
          fd2.append("subject",    `Your POPPYPINK Order is Confirmed! 🎉 [${newOrderId}]`);
          fd2.append("from_name",  "POPPYPINK");
          fd2.append("message", [
            `Hi ${form.name}! 👋`,
            "",
            "Thank you for shopping with POPPYPINK! 👡",
            "Your payment was successful and your order is confirmed.",
            "",
            "━━━━━━━━━━━━━━━━━━━━━━━━━",
            "🧾  ORDER CONFIRMATION",
            "━━━━━━━━━━━━━━━━━━━━━━━━━",
            `Order ID  : ${newOrderId}`,
            `Total     : ₹${total.toLocaleString()}`,
            `Payment   : Online Payment 💳 ✅`,
            `Date      : ${new Date().toLocaleString("en-IN")}`,
            "",
            "🛍️  ITEMS ORDERED",
            "━━━━━━━━━━━━━━━━━━━━━━━━━",
            itemsForEmail,
            "",
            "📦  DELIVERY ADDRESS",
            "━━━━━━━━━━━━━━━━━━━━━━━━━",
            `  ${form.address}`,
            `  ${form.city}, ${form.state} — ${form.pincode}`,
            `  Phone: ${form.phone}`,
            "",
            "━━━━━━━━━━━━━━━━━━━━━━━━━",
            "🚚 Expected delivery: 3–5 business days.",
            "",
            "📍 Track your order anytime: poppypinkshoes.com/track",
            "   (Use your Order ID: " + newOrderId + ")",
            "",
            "Thanks again for choosing POPPYPINK! 💖",
            "— The POPPYPINK Team",
          ].join("\n"));
          await fetch("https://api.web3forms.com/submit", { method:"POST", body:fd2 });
        } catch (_) {}
      }
    }

    setSnapCart([...cart]);
    setSnapTotal(total);
    setPlacedOrderId(newOrderId);
    setSent(true);
    clearCart?.();
    setTimeout(() => fetchMyOrders(), 1200);
  };

  const handleCheckoutOrder = async () => {
    const err = validate();
    if (Object.keys(err).length) { setFormErr(err); return; }
    setSending(true);

    try {
      const firstItem     = cart[0];
      const customerEmail = user?.primaryEmailAddress?.emailAddress || "";

      // Build order payload (reused in verify step)
      const orderData = {
        customerName:  form.name.trim(),
        customerPhone: form.phone.trim(),
        customerEmail,
        userId: user?.id || "",
        address: {
          line1:   form.address.trim(),
          city:    form.city.trim(),
          state:   form.state.trim(),
          pincode: form.pincode.trim(),
        },
        product: {
          id:       firstItem.id,
          name:     cart.length > 1 ? `${firstItem.name} + ${cart.length-1} more` : firstItem.name,
          article:  firstItem.article || "",
          category: firstItem.category || "",
          size:     firstItem.size || "",
          color:    firstItem.selColor?.name || firstItem.selColor || "",
          qty:      cart.reduce((s,i) => s + i.qty, 0),
          price:    firstItem.offerPrice,
          image:    firstItem.image || firstItem.images?.[0] || "",
        },
        totalAmount: total,
      };

      // ── Step 1: Create Razorpay order on server
      const rzRes  = await fetch("/api/razorpay/create-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ amount: total, receipt: `cart_${Date.now()}` }),
      });
      const rzData = await rzRes.json();
      if (!rzRes.ok) throw new Error(rzData.error || "Could not initiate payment");

      setSending(false); // stop spinner while Razorpay popup is open

      // ── Step 2: Open Razorpay checkout popup
      const options = {
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      rzData.amount,
        currency:    rzData.currency,
        name:        "POPPYPINK",
        description: orderData.product.name,
        image:       "/logo.png",
        order_id:    rzData.id,
        prefill: {
          name:    form.name.trim(),
          email:   customerEmail,
          contact: form.phone.trim(),
        },
        theme:  { color: "#e55d6a" },
        modal:  { backdropclose: false },

        // ── Step 3: On payment success → verify + save order
        handler: async (response) => {
          setSending(true);
          try {
            const verifyRes  = await fetch("/api/razorpay/verify", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                orderData,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");

            await handlePaymentSuccess(verifyData.orderId, customerEmail);
          } catch (e) {
            alert("Payment succeeded but order save failed: " + e.message + "\nPlease contact support with your payment ID: " + response.razorpay_payment_id);
          } finally {
            setSending(false);
          }
        },

        // Payment failed / dismissed
        modal: {
          ondismiss: () => { setSending(false); },
        },
      };

      const rzPopup = new window.Razorpay(options);
      rzPopup.on("payment.failed", (response) => {
        setSending(false);
        alert("Payment failed: " + (response.error?.description || "Please try again."));
      });
      rzPopup.open();

    } catch (e) {
      alert("Checkout error: " + e.message);
      setSending(false);
    }
  };

  const displayCart  = sent ? snapCart  : cart;
  const displayTotal = sent ? snapTotal : total;

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });

  return (
    <>
      <Head><title>Cart — POPPYPINK</title></Head>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <style suppressHydrationWarning>{`
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes popIn    { 0%{transform:scale(0);opacity:0} 80%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes slideDown{ from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

        .qty-btn{width:32px;height:32px;border-radius:8px;background:rgba(229,93,106,.1);border:1.5px solid rgba(229,93,106,.25);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#1a1a1a;font-weight:700;font-size:1.1rem;transition:all .2s}
        .qty-btn:hover{background:rgba(229,93,106,.2)}
        .rm-btn{background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem;transition:color .2s;padding:.25rem}
        .rm-btn:hover{color:${BRAND}}
        .cart-row{border-radius:18px;padding:1.25rem 1.5rem;display:flex;gap:1.25rem;align-items:center;flex-wrap:wrap;background:#fff;border:1.5px solid rgba(229,93,106,.12);box-shadow:0 4px 16px rgba(229,93,106,.06);transition:all .25s}
        .cart-row:hover{box-shadow:0 8px 28px rgba(229,93,106,.12);border-color:rgba(229,93,106,.28);transform:translateY(-1px)}

        .page-tab{padding:.6rem 1.6rem;border-radius:50px;border:none;font-family:'DM Sans',sans-serif;font-weight:700;font-size:.88rem;cursor:pointer;transition:all .25s;letter-spacing:.03em}
        .page-tab.active{background:${BRAND};color:#fff;box-shadow:0 6px 18px rgba(229,93,106,.35)}
        .page-tab:not(.active){background:rgba(229,93,106,.07);color:#888}
        .page-tab:not(.active):hover{background:rgba(229,93,106,.14);color:${BRAND}}

        .order-card{background:#fff;border:1.5px solid rgba(229,93,106,.12);border-radius:18px;overflow:hidden;transition:all .25s;box-shadow:0 4px 16px rgba(229,93,106,.05)}
        .order-card:hover{border-color:rgba(229,93,106,.3);box-shadow:0 8px 28px rgba(229,93,106,.1)}
        .order-card-header{padding:1.1rem 1.4rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;cursor:pointer;user-select:none}
        .order-card-body{padding:0 1.4rem 1.2rem;animation:slideDown .25s ease}
        .order-img{width:54px;height:54px;border-radius:10px;object-fit:cover;border:1.5px solid rgba(229,93,106,.15);flex-shrink:0}

        .co-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn .3s ease}
        .co-box{background:#fff;border-radius:20px;width:100%;max-width:760px;max-height:92vh;overflow-y:auto;animation:fadeUp .4s ease;box-shadow:0 30px 80px rgba(0,0,0,.18);padding:2rem 2.5rem}
        .co-box::-webkit-scrollbar{width:4px}.co-box::-webkit-scrollbar-thumb{background:${BRAND};border-radius:2px}

        .co-input{width:100%;padding:.65rem .9rem;border:1.5px solid rgba(229,93,106,.22);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:.88rem;color:#1a1a1a;outline:none;transition:border-color .2s,box-shadow .2s;background:#fff;box-sizing:border-box}
        .co-input:focus{border-color:${BRAND};box-shadow:0 0 0 3px rgba(229,93,106,.1)}
        .co-input.err{border-color:#dc2626}
        .co-err{color:#dc2626;font-size:.7rem;margin-top:.2rem}

        .co-btn{width:100%;padding:.9rem;font-family:'DM Sans',sans-serif;font-weight:700;font-size:.96rem;border:none;border-radius:12px;cursor:pointer;transition:all .3s;letter-spacing:.04em}
        .co-btn-primary{background:${BRAND};color:#fff;box-shadow:0 8px 24px rgba(229,93,106,.3)}
        .co-btn-primary:hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(229,93,106,.4)}
        .co-btn-primary:disabled{opacity:.65;cursor:not-allowed;transform:none}
        .co-btn-outline{background:rgba(229,93,106,.06);border:2px solid rgba(229,93,106,.25);color:${BRAND}}
        .co-btn-outline:hover{background:rgba(229,93,106,.12);border-color:${BRAND}}

        .signin-btn{width:100%;padding:.95rem;font-size:.94rem;border-radius:12px;background:${BRAND};border:none;color:#fff;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;box-shadow:0 8px 24px rgba(229,93,106,.3);transition:all .3s;letter-spacing:.04em;display:flex;align-items:center;justify-content:center;gap:.5rem}
        .signin-btn:hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(229,93,106,.45)}

        @media(max-width:640px){.co-2col{grid-template-columns:1fr!important}.order-grid{grid-template-columns:1fr!important}}
      `}</style>

      <Navbar footerRef={footerRef} />

      <div style={{ minHeight:"100vh", background:"#f9f9f9", padding:"100px 2rem 5rem" }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>

          {/* ── Page Header + Tabs ── */}
          <div style={{ marginBottom:"2rem" }}>
            <p style={{ color:BRAND, fontSize:".75rem", fontWeight:800, letterSpacing:".22em", textTransform:"uppercase", marginBottom:".4rem" }}>✦ POPPYPINK ✦</p>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,5vw,3rem)", fontWeight:900, color:"#1a1a1a", marginBottom:"1.25rem" }}>
              My <em style={{ fontStyle:"italic", color:BRAND }}>{activeTab === "orders" ? "Orders" : "Cart"}</em>
            </h1>
            <div style={{ display:"flex", gap:".6rem", flexWrap:"wrap" }}>
              <button className={`page-tab ${activeTab==="cart"?"active":""}`} onClick={() => setActiveTab("cart")}>
                🛒 Cart
                {cart.length > 0 && (
                  <span style={{ background: activeTab==="cart" ? "rgba(255,255,255,.3)" : BRAND, color:"#fff", borderRadius:20, padding:".05rem .45rem", marginLeft:".35rem", fontSize:".72rem" }}>
                    {cart.length}
                  </span>
                )}
              </button>
              {isSignedIn && (
                <button className={`page-tab ${activeTab==="orders"?"active":""}`} onClick={() => setActiveTab("orders")}>
                  📦 My Orders
                </button>
              )}
            </div>
          </div>

          {/* ══════════════════════════
              TAB — CART
          ══════════════════════════ */}
          {activeTab === "cart" && (
            <>
              {cart.length === 0 && !sent ? (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#fff", borderRadius:24, padding:"4rem 2rem", textAlign:"center", border:"1.5px solid rgba(229,93,106,.1)" }}>
                  <div style={{ fontSize:"5rem", marginBottom:"1.5rem" }}>🛍️</div>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"2.2rem", color:"#1a1a1a", marginBottom:".75rem" }}>Your cart is empty</h2>
                  <p style={{ color:"#888", marginBottom:"2.5rem" }}>Discover gorgeous sandals and add them to your cart!</p>
                  <Link href="/" style={{ background:BRAND, color:"#fff", padding:".8rem 2rem", borderRadius:50, fontWeight:700, textDecoration:"none", boxShadow:`0 8px 24px rgba(229,93,106,.3)` }}>
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div style={{ display:"flex", flexDirection:"column", gap:"1rem", marginBottom:"2.5rem" }}>
                    {cart.map(item => (
                      <div key={item.id} className="cart-row">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image || item.images?.[0]} alt={item.name}
                          style={{ width:78, height:78, borderRadius:14, objectFit:"cover", flexShrink:0, border:`2px solid rgba(229,93,106,.15)` }}/>
                        <div style={{ flex:1, minWidth:140 }}>
                          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#1a1a1a", fontSize:"1rem" }}>{item.name}</div>
                          <div style={{ color:BRAND, fontSize:".7rem", fontWeight:800, letterSpacing:".08em", textTransform:"uppercase", marginTop:".15rem" }}>{item.category}</div>
                          {item.size && <div style={{ color:"#aaa", fontSize:".75rem", marginTop:".1rem" }}>Size: {item.size}</div>}
                          <div style={{ color:BRAND, fontWeight:800, fontSize:"1rem", marginTop:".3rem" }}>₹{item.offerPrice.toLocaleString()}</div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:".55rem" }}>
                          <div className="qty-btn" onClick={()=>updateQty(item.id,item.qty-1)}>−</div>
                          <span style={{ fontWeight:700, color:"#1a1a1a", minWidth:"1.5rem", textAlign:"center" }}>{item.qty}</span>
                          <div className="qty-btn" onClick={()=>updateQty(item.id,item.qty+1)}>+</div>
                        </div>
                        <div style={{ fontWeight:800, color:"#1a1a1a", minWidth:90, textAlign:"right" }}>₹{(item.offerPrice*item.qty).toLocaleString()}</div>
                        <button className="rm-btn" onClick={()=>removeFromCart(item.id)}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary box */}
                  <div style={{ maxWidth:440, marginLeft:"auto", borderRadius:22, padding:"2rem", background:"#fff", border:`1.5px solid rgba(229,93,106,.15)`, boxShadow:"0 12px 40px rgba(229,93,106,.08)" }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.3rem", color:"#1a1a1a", marginBottom:"1.25rem", fontWeight:700 }}>Order Summary</h3>
                    {[
                      ["Subtotal", `₹${total.toLocaleString()}`, "#1a1a1a"],
                      ["Shipping", "Free ✓",                     "#16a34a"],
                      ["Discount", "Applied 🏷️",                 BRAND],
                    ].map(([k,v,col]) => (
                      <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:".75rem", fontSize:".88rem" }}>
                        <span style={{ color:"#888" }}>{k}</span>
                        <span style={{ fontWeight:700, color:col }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ borderTop:`1.5px solid rgba(229,93,106,.12)`, paddingTop:"1rem", display:"flex", justifyContent:"space-between", marginBottom:"1.4rem" }}>
                      <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:"1.1rem", color:"#1a1a1a" }}>Total</span>
                      <span style={{ fontWeight:800, fontSize:"1.2rem", color:BRAND }}>₹{total.toLocaleString()}</span>
                    </div>

                    {isSignedIn ? (
                      <button
                        style={{ width:"100%", padding:".95rem", fontSize:".94rem", borderRadius:12, background:BRAND, border:"none", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontWeight:700, cursor:"pointer", boxShadow:`0 8px 24px rgba(229,93,106,.3)`, transition:"all .3s", letterSpacing:".04em" }}
                        onMouseOver={e=>e.currentTarget.style.transform="translateY(-2px)"}
                        onMouseOut={e=>e.currentTarget.style.transform="none"}
                        onClick={handleOpenCheckout}
                      >
                        Proceed to Checkout →
                      </button>
                    ) : (
                      <div>
                        <SignInButton mode="modal" afterSignInUrl="/cart">
                          <button className="signin-btn">🔒 Sign In to Checkout →</button>
                        </SignInButton>
                        <p style={{ textAlign:"center", color:"#aaa", fontSize:".72rem", marginTop:".6rem" }}>Sign in to securely place your order</p>
                      </div>
                    )}

                    <div style={{ display:"flex", gap:".5rem", justifyContent:"center", marginTop:".75rem" }}>
                      {["🔒 Secure","💳 Online","🚚 Free Ship"].map(t=>(
                        <span key={t} style={{ fontSize:".68rem", color:"#aaa", fontWeight:600 }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <Link href="/" style={{ display:"inline-block", marginTop:"2rem", color:BRAND, fontWeight:600, textDecoration:"none", fontSize:".9rem" }}>← Continue Shopping</Link>
                </>
              )}
            </>
          )}

          {/* ══════════════════════════
              TAB — MY ORDERS
          ══════════════════════════ */}
          {activeTab === "orders" && isSignedIn && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
                <p style={{ color:"#888", fontSize:".9rem" }}>
                  {ordersLoading ? "Loading your orders…" : `${myOrders.length} order${myOrders.length!==1?"s":""} found`}
                </p>
                <button onClick={fetchMyOrders}
                  style={{ background:"none", border:`1.5px solid rgba(229,93,106,.25)`, borderRadius:20, padding:".35rem .9rem", color:BRAND, fontWeight:700, fontSize:".78rem", cursor:"pointer", transition:"all .2s" }}
                  onMouseOver={e=>e.currentTarget.style.background="rgba(229,93,106,.06)"}
                  onMouseOut={e=>e.currentTarget.style.background="none"}>
                  ↻ Refresh
                </button>
              </div>

              {ordersLoading ? (
                <div style={{ display:"flex", justifyContent:"center", padding:"5rem" }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", border:`3px solid rgba(229,93,106,.15)`, borderTop:`3px solid ${BRAND}`, animation:"spin 1s linear infinite" }}/>
                </div>
              ) : myOrders.length === 0 ? (
                <div style={{ background:"#fff", borderRadius:20, padding:"4rem 2rem", textAlign:"center", border:"1.5px solid rgba(229,93,106,.1)" }}>
                  <div style={{ fontSize:"4rem", marginBottom:"1rem" }}>📭</div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", color:"#1a1a1a", marginBottom:".5rem" }}>No orders yet</h3>
                  <p style={{ color:"#888", marginBottom:"2rem" }}>Your placed orders will appear here</p>
                  <button className="page-tab active" onClick={() => setActiveTab("cart")} style={{ border:"none", cursor:"pointer" }}>
                    Start Shopping →
                  </button>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                  {myOrders.map(order => {
                    const st     = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                    const isOpen = expandedOrder === order._id;
                    return (
                      <div key={order._id} className="order-card">

                        {/* ── Header row (always visible, click to expand) ── */}
                        <div className="order-card-header" onClick={() => setExpandedOrder(isOpen ? null : order._id)}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={order.product?.image || "/placeholder.png"} alt={order.product?.name} className="order-img"/>

                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#1a1a1a", fontSize:".97rem", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                              {order.product?.name}
                            </div>
                            <div style={{ display:"flex", gap:".5rem", alignItems:"center", marginTop:".25rem", flexWrap:"wrap" }}>
                              <code style={{ fontFamily:"monospace", fontSize:".72rem", fontWeight:800, color:BRAND, background:"rgba(229,93,106,.08)", padding:".1rem .45rem", borderRadius:6 }}>
                                {order.orderId}
                              </code>
                              <span style={{ fontSize:".72rem", color:"#aaa" }}>{fmtDate(order.createdAt)}</span>
                            </div>
                          </div>

                          <div style={{ textAlign:"right", flexShrink:0 }}>
                            <div style={{ fontWeight:800, color:"#1a1a1a", fontSize:"1rem" }}>₹{order.totalAmount?.toLocaleString()}</div>
                            <div style={{ fontSize:".7rem", color:"#aaa", marginTop:".15rem" }}>💳 Online</div>
                          </div>

                          <div style={{ background:st.bg, color:st.color, fontWeight:700, fontSize:".72rem", padding:".3rem .75rem", borderRadius:20, whiteSpace:"nowrap", flexShrink:0 }}>
                            {st.label}
                          </div>

                          <div style={{ color:"#ccc", fontSize:".9rem", transition:"transform .25s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink:0 }}>▼</div>
                        </div>

                        {/* ── Expanded body ── */}
                        {isOpen && (
                          <div className="order-card-body">
                            <div style={{ borderTop:"1px solid rgba(229,93,106,.1)", paddingTop:"1rem" }}>

                              <div className="order-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>

                                {/* Product details */}
                                <div style={{ background:"rgba(229,93,106,.03)", borderRadius:12, padding:"1rem", border:"1px solid rgba(229,93,106,.09)" }}>
                                  <div style={{ fontSize:".7rem", fontWeight:800, color:"#aaa", textTransform:"uppercase", letterSpacing:".1em", marginBottom:".7rem" }}>🛍️ Product</div>
                                  {[
                                    ["Name",       order.product?.name],
                                    ["Article",    order.product?.article  || "—"],
                                    ["Category",   order.product?.category || "—"],
                                    ["Size",       order.product?.size     || "—"],
                                    ["Color",      order.product?.color    || "—"],
                                    ["Qty",        order.product?.qty],
                                    ["Unit Price", `₹${order.product?.price?.toLocaleString()}`],
                                    ["Total",      `₹${order.totalAmount?.toLocaleString()}`],
                                  ].map(([k,v]) => (
                                    <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:".82rem", marginBottom:".35rem" }}>
                                      <span style={{ color:"#aaa" }}>{k}</span>
                                      <strong style={{ color:"#1a1a1a", textAlign:"right", maxWidth:"60%" }}>{v}</strong>
                                    </div>
                                  ))}
                                </div>

                                {/* Delivery details */}
                                <div style={{ background:"rgba(229,93,106,.03)", borderRadius:12, padding:"1rem", border:"1px solid rgba(229,93,106,.09)" }}>
                                  <div style={{ fontSize:".7rem", fontWeight:800, color:"#aaa", textTransform:"uppercase", letterSpacing:".1em", marginBottom:".7rem" }}>📦 Delivery</div>
                                  {[
                                    ["Name",    order.customerName],
                                    ["Phone",   order.customerPhone],
                                    ["Address", order.address?.line1],
                                    ["City",    order.address?.city],
                                    ["State",   order.address?.state],
                                    ["Pincode", order.address?.pincode],
                                    ["Payment", "💳 Online Payment"],
                                  ].map(([k,v]) => (
                                    <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:".82rem", marginBottom:".35rem" }}>
                                      <span style={{ color:"#aaa" }}>{k}</span>
                                      <strong style={{ color:"#1a1a1a", textAlign:"right", maxWidth:"60%" }}>{v || "—"}</strong>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Order ID bar + Track button */}
                              <div style={{ padding:".9rem 1rem", background:"rgba(229,93,106,.04)", borderRadius:12, border:"1px solid rgba(229,93,106,.1)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:".75rem" }}>
                                <div>
                                  <div style={{ fontSize:".65rem", color:"#aaa", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", marginBottom:".15rem" }}>Order ID</div>
                                  <code style={{ fontFamily:"monospace", fontWeight:900, fontSize:"1.1rem", color:BRAND, letterSpacing:".08em" }}>{order.orderId}</code>
                                </div>
                                <Link href={`/track?orderId=${order.orderId}`}
                                  style={{ background:BRAND, color:"#fff", padding:".5rem 1.25rem", borderRadius:20, fontWeight:700, fontSize:".8rem", textDecoration:"none", boxShadow:`0 4px 14px rgba(229,93,106,.3)`, transition:"all .2s" }}>
                                  Track Order →
                                </Link>
                              </div>

                              {/* Admin note (if any) */}
                              {order.adminNote && (
                                <div style={{ marginTop:".75rem", padding:".75rem 1rem", background:"#fffbeb", borderRadius:10, border:"1px solid #fde68a", fontSize:".82rem", color:"#92400e" }}>
                                  <strong>📝 Note from store:</strong> {order.adminNote}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <Footer ref={footerRef} />

      {/* ════════════════════════════════
          CHECKOUT MODAL
      ════════════════════════════════ */}
      {checkoutOpen && (
        <div className="co-overlay" onClick={() => { if (!sending) setCheckoutOpen(false); }}>
          <div className="co-box" onClick={e => e.stopPropagation()}>

            {sent ? (
              /* ── Success screen ── */
              <div style={{ textAlign:"center", padding:"1.5rem 0" }}>
                <div style={{ fontSize:"3.5rem", marginBottom:"1rem", animation:"popIn .5s ease" }}>✅</div>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", color:"#1a1a1a", marginBottom:".6rem" }}>Order Placed!</h2>
                <p style={{ color:"#666", marginBottom:"1rem" }}>Thank you <strong>{form.name}</strong>!</p>

                <div style={{ display:"inline-block", margin:".4rem 0 1rem", padding:".85rem 1.5rem", background:"rgba(229,93,106,.07)", borderRadius:14, border:`1.5px solid rgba(229,93,106,.2)` }}>
                  <div style={{ fontSize:".68rem", color:"#aaa", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", marginBottom:".18rem" }}>Order ID</div>
                  <div style={{ fontFamily:"monospace", fontWeight:900, fontSize:"1.4rem", color:BRAND, letterSpacing:".1em" }}>{placedOrderId}</div>
                  <div style={{ fontSize:".7rem", color:"#aaa", marginTop:".12rem" }}>Visible in My Orders tab</div>
                </div>

                {user?.primaryEmailAddress?.emailAddress && (
                  <div style={{ maxWidth:380, margin:"0 auto .9rem", padding:".65rem 1rem", background:"rgba(22,163,74,.06)", border:"1px solid rgba(22,163,74,.2)", borderRadius:12, fontSize:".8rem", color:"#15803d" }}>
                    📧 Confirmation email sent to <strong>{user.primaryEmailAddress.emailAddress}</strong>
                  </div>
                )}

                <div style={{ maxWidth:380, margin:"0 auto 1.2rem", background:"#fdf5f6", borderRadius:14, padding:"1rem 1.4rem", textAlign:"left", border:`1px solid rgba(229,93,106,.12)` }}>
                  {displayCart.map(item => (
                    <div key={item.id} style={{ display:"flex", justifyContent:"space-between", fontSize:".84rem", color:"#666", marginBottom:".35rem" }}>
                      <span>{item.name} ×{item.qty}</span>
                      <strong style={{ color:"#1a1a1a" }}>₹{(item.offerPrice*item.qty).toLocaleString()}</strong>
                    </div>
                  ))}
                  <div style={{ borderTop:`1px solid rgba(229,93,106,.12)`, paddingTop:".4rem", marginTop:".4rem", display:"flex", justifyContent:"space-between", fontWeight:800 }}>
                    <span style={{ color:"#1a1a1a" }}>Total</span>
                    <span style={{ color:BRAND }}>₹{displayTotal.toLocaleString()}</span>
                  </div>
                  <div style={{ marginTop:".5rem", fontSize:".8rem", color:"#666" }}>
                    Payment: <strong>💳 Online Payment</strong>
                  </div>
                </div>

                <p style={{ color:"#888", fontSize:".83rem", marginBottom:"1.5rem" }}>
                  We'll call/WhatsApp <strong>{form.phone}</strong> to confirm.
                </p>

                <div style={{ display:"flex", gap:".75rem", justifyContent:"center", flexWrap:"wrap" }}>
                  <button className="co-btn co-btn-primary" style={{ maxWidth:200 }}
                    onClick={() => { setCheckoutOpen(false); setSent(false); }}>
                    Continue Shopping
                  </button>
                  <button className="co-btn co-btn-outline" style={{ maxWidth:200 }}
                    onClick={() => { setCheckoutOpen(false); setSent(false); setActiveTab("orders"); }}>
                    📦 View My Orders
                  </button>
                </div>
              </div>

            ) : (
              /* ── Checkout form ── */
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
                  <div>
                    <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.7rem", color:"#1a1a1a", margin:0 }}>Checkout</h2>
                    {user && (
                      <p style={{ color:"#aaa", fontSize:".78rem", margin:".3rem 0 0", display:"flex", alignItems:"center", gap:".35rem" }}>
                        <span style={{ color:"#16a34a", fontWeight:700 }}>✓</span>
                        Signed in as <strong style={{ color:"#555" }}>{user.primaryEmailAddress?.emailAddress}</strong>
                      </p>
                    )}
                  </div>
                  <button onClick={() => setCheckoutOpen(false)}
                    style={{ background:"none", border:"none", cursor:"pointer", color:"#aaa", fontSize:"1.4rem", lineHeight:1, transition:"color .2s" }}
                    onMouseOver={e=>e.currentTarget.style.color=BRAND} onMouseOut={e=>e.currentTarget.style.color="#aaa"}>✕</button>
                </div>

                <div style={{ background:"rgba(229,93,106,.04)", border:`1px solid rgba(229,93,106,.12)`, borderRadius:14, padding:"1rem", marginBottom:"1.5rem" }}>
                  <div style={{ fontSize:".75rem", fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".1em", marginBottom:".6rem" }}>Your Items ({cart.length})</div>
                  {cart.map(item => (
                    <div key={item.id} style={{ display:"flex", justifyContent:"space-between", fontSize:".84rem", color:"#666", marginBottom:".3rem" }}>
                      <span>{item.name} ×{item.qty}</span>
                      <strong style={{ color:BRAND }}>₹{(item.offerPrice*item.qty).toLocaleString()}</strong>
                    </div>
                  ))}
                  <div style={{ borderTop:`1px solid rgba(229,93,106,.12)`, paddingTop:".5rem", marginTop:".5rem", display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:"1rem" }}>
                    <span style={{ color:"#1a1a1a" }}>Total</span>
                    <span style={{ color:BRAND }}>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="co-2col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".85rem", marginBottom:"1.25rem" }}>
                  {[
                    { key:"name",    label:"Full Name *",        col:"1/-1", placeholder:"Your full name",         type:"text" },
                    { key:"phone",   label:"Phone Number *",     col:"1/-1", placeholder:"10-digit mobile number",  type:"tel"  },
                    { key:"address", label:"Delivery Address *", col:"1/-1", placeholder:"House no, street, area",  type:"text" },
                    { key:"city",    label:"City *",             col:"",     placeholder:"City",                    type:"text" },
                    { key:"state",   label:"State *",            col:"",     placeholder:"State",                   type:"text" },
                    { key:"pincode", label:"Pincode *",          col:"1/-1", placeholder:"6-digit pincode",         type:"text" },
                  ].map(({ key, label, col, placeholder, type }) => (
                    <div key={key} style={col ? { gridColumn:col } : {}}>
                      <label style={{ fontSize:".8rem", fontWeight:700, color:"#1a1a1a", display:"block", marginBottom:".3rem" }}>{label}</label>
                      <input
                        className={`co-input ${formErr[key]?"err":""}`}
                        placeholder={placeholder}
                        type={type}
                        maxLength={key==="phone"?10:key==="pincode"?6:undefined}
                        value={form[key]}
                        onChange={e => {
                          const v = (key==="phone"||key==="pincode") ? e.target.value.replace(/\D/g,"") : e.target.value;
                          setForm(p=>({...p,[key]:v}));
                          setFormErr(p=>({...p,[key]:""}));
                        }}
                      />
                      {formErr[key] && <div className="co-err">{formErr[key]}</div>}
                    </div>
                  ))}

                  {/* Payment Method - Online only */}
                  <div style={{ gridColumn:"1/-1" }}>
                    <div style={{ fontSize:".8rem", fontWeight:700, color:"#1a1a1a", marginBottom:".6rem" }}>Payment Method</div>
                    <div style={{ display:"flex", alignItems:"center", gap:".75rem", padding:".85rem 1.1rem", background:"rgba(229,93,106,.05)", border:`1.5px solid rgba(229,93,106,.2)`, borderRadius:14 }}>
                      <span style={{ fontSize:"1.4rem" }}>💵</span>
                      <div>
                        <div style={{ fontWeight:700, color:"#1a1a1a", fontSize:".9rem" }}>Online Payment</div>
                        <div style={{ color:"#aaa", fontSize:".76rem" }}>Pay via UPI, Card or Net Banking</div>
                      </div>
                      <div style={{ marginLeft:"auto", background:"rgba(22,163,74,.1)", color:"#16a34a", fontWeight:700, fontSize:".72rem", padding:".25rem .65rem", borderRadius:20 }}>✓ Selected</div>
                    </div>
                  </div>
                </div>

                <button className="co-btn co-btn-primary" onClick={handleCheckoutOrder} disabled={sending}>
                  {sending ? (
                    <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:".5rem" }}>
                      <span style={{ width:18, height:18, borderRadius:"50%", border:"2.5px solid rgba(255,255,255,.35)", borderTop:"2.5px solid #fff", animation:"spin 1s linear infinite", display:"inline-block" }}/>
                      Processing…
                    </span>
                  ) : `💳 Pay Now — ₹${total.toLocaleString()}`}
                </button>
                <p style={{ textAlign:"center", color:"#aaa", fontSize:".7rem", marginTop:".5rem" }}>
                  Secure payment via Razorpay · UPI, Cards, Net Banking accepted.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}