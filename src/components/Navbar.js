// src/components/Navbar.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { useUser, SignOutButton } from "@clerk/nextjs";
import PoppyPinkLogo from "./PoppyPinkLogo";

const BRAND = "#e55d6a";
const BRAND_DARK = "#C42E15";

export default function Navbar({ footerRef }) {
  const { count } = useCart();
  const { user, isSignedIn, isLoaded } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [shadow, setShadow] = useState(false);
  const router = useRouter();

  const isAdmin = isSignedIn && (
    user?.publicMetadata?.role === "admin" ||
    (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",")
      .map(e => e.trim().toLowerCase())
      .includes(user?.primaryEmailAddress?.emailAddress?.toLowerCase())
  );

  useEffect(() => {
    const fn = () => setShadow(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollToFooter = () => {
    setMenuOpen(false);
    if (router.pathname !== "/") {
      router.push("/").then(() =>
        setTimeout(() => footerRef?.current?.scrollIntoView({ behavior: "smooth" }), 200)
      );
    } else {
      footerRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{`
        .nlink { color:rgba(255,255,255,.9); font-size:.9rem; font-weight:600; letter-spacing:.05em; cursor:pointer; background:none; border:none; font-family:'DM Sans',sans-serif; transition:all .2s; text-decoration:none; padding:.3rem .6rem; border-radius:6px; }
        .nlink:hover { color:#fff; background:rgba(255,255,255,.15); }
        .cart-btn { position:relative; background:none; border:none; cursor:pointer; color:rgba(255,255,255,.9); padding:.4rem; display:flex; align-items:center; transition:all .2s; border-radius:8px; }
        .cart-btn:hover { background:rgba(255,255,255,.15); color:#fff; }
        .cbadge { position:absolute; top:-5px; right:-6px; background:#fff; color:${BRAND}; border-radius:50%; width:18px; height:18px; font-size:.6rem; display:flex; align-items:center; justify-content:center; font-weight:800; }
        .hline { width:24px; height:2.5px; border-radius:2px; background:#fff; transition:all .3s; display:block; }
        .mlink { color:#fff; font-size:1rem; font-weight:600; padding:.9rem 0; text-decoration:none; display:block; background:none; border:none; font-family:'DM Sans',sans-serif; cursor:pointer; text-align:left; letter-spacing:.04em; border-bottom:1px solid rgba(255,255,255,.18); width:100%; }
        .mlink:hover { opacity:.75; }
        .user-avatar { width:34px; height:34px; border-radius:50%; border:2px solid rgba(255,255,255,.5); cursor:pointer; object-fit:cover; transition:border-color .2s; flex-shrink:0; }
        .user-avatar:hover { border-color:#fff; }
        .user-menu { position:absolute; top:calc(100% + 8px); right:0; background:#fff; border-radius:14px; padding:.5rem; box-shadow:0 16px 48px rgba(0,0,0,.2); border:1px solid rgba(232,57,29,.15); min-width:200px; z-index:300; animation:fadeUp .2s ease; }
        .umitem { display:flex; align-items:center; gap:.6rem; padding:.6rem .85rem; border-radius:8px; font-size:.85rem; font-weight:600; color:#1A0500; cursor:pointer; background:none; border:none; font-family:'DM Sans',sans-serif; width:100%; text-align:left; text-decoration:none; transition:background .15s; }
        .umitem:hover { background:rgba(232,57,29,.07); color:${BRAND}; }
        .umitem.danger { color:#dc2626; }
        .umitem.danger:hover { background:rgba(220,38,38,.07); }
        .um-divider { height:1px; background:rgba(232,57,29,.12); margin:.3rem 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200, height:68,
        background: BRAND,
        boxShadow: shadow ? "0 4px 24px rgba(0,0,0,.28)" : "0 2px 10px rgba(0,0,0,.15)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 2.5rem", transition:"box-shadow .3s",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration:"none" }}>
          <PoppyPinkLogo size={38} textSize="1.45rem" onDark />
        </Link>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
         
          <Link href="/track" className="nlink">Track Order</Link>
          <button className="nlink" onClick={scrollToFooter}>Contact</button>
          {isAdmin && <Link href="/admin" className="nlink" style={{ background:"rgba(255,255,255,.15)", borderRadius:8 }}>⚙ Admin</Link>}

          {/* Cart */}
          <Link href="/cart" style={{ textDecoration:"none", marginLeft:".5rem" }}>
            <button className="cart-btn">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {count > 0 && <span className="cbadge">{count}</span>}
            </button>
          </Link>

          {/* User avatar / auth */}
          {isLoaded && (
            <div style={{ position:"relative", marginLeft:".5rem" }}>
              {isSignedIn ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "User"}
                    className="user-avatar"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  />
                  {userMenuOpen && (
                    <>
                      <div style={{ position:"fixed", inset:0, zIndex:299 }} onClick={() => setUserMenuOpen(false)}/>
                      <div className="user-menu">
                        <div style={{ padding:".6rem .85rem .4rem", borderBottom:"1px solid rgba(232,57,29,.1)", marginBottom:".3rem" }}>
                          <div style={{ fontWeight:700, color:"#1A0500", fontSize:".88rem", lineHeight:1.2 }}>{user.fullName}</div>
                          <div style={{ color:"#B07060", fontSize:".72rem", marginTop:".15rem" }}>{user.primaryEmailAddress?.emailAddress}</div>
                          {isAdmin && <span style={{ fontSize:".65rem", fontWeight:800, background:"rgba(232,57,29,.1)", color:BRAND, padding:".15rem .5rem", borderRadius:10, display:"inline-block", marginTop:".35rem", letterSpacing:".08em" }}>ADMIN</span>}
                        </div>
                        {isAdmin && (
                          <Link href="/admin" className="umitem" onClick={() => setUserMenuOpen(false)}>
                            ⚙️ Admin Panel
                          </Link>
                        )}
                        <Link href="/track" className="umitem" onClick={() => setUserMenuOpen(false)}>
                          📦 Track Order
                        </Link>
                        <div className="um-divider"/>
                        <SignOutButton>
                          <button className="umitem danger">🚪 Sign Out</button>
                        </SignOutButton>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link href="/sign-in" className="nlink" style={{ background:"rgba(255,255,255,.18)", borderRadius:8, padding:".3rem .85rem" }}>
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background:"none", border:"none", cursor:"pointer", flexDirection:"column", gap:5, padding:".5rem" }}>
          {[0,1,2].map(i => (
            <span key={i} className="hline" style={{
              opacity: menuOpen && i===1 ? 0 : 1,
              transform: menuOpen ? (i===0 ? "rotate(45deg) translate(5px,5px)" : i===2 ? "rotate(-45deg) translate(5px,-5px)" : "none") : "none",
            }}/>
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          position:"fixed", top:68, left:0, right:0, zIndex:199,
          background: BRAND_DARK, padding:"0 2.5rem 1.5rem",
          boxShadow:"0 10px 30px rgba(0,0,0,.2)", display:"flex", flexDirection:"column",
        }}>
          
          <Link href="/track" className="mlink" onClick={() => setMenuOpen(false)}>Track Order</Link>
          <button className="mlink" onClick={scrollToFooter}>Contact</button>
          {isAdmin && <Link href="/admin" className="mlink" onClick={() => setMenuOpen(false)}>⚙ Admin Panel</Link>}
          <Link href="/cart"  className="mlink" onClick={() => setMenuOpen(false)}>Cart{count > 0 ? ` (${count})` : ""}</Link>
          {isLoaded && !isSignedIn && <Link href="/sign-in" className="mlink" onClick={() => setMenuOpen(false)}>Sign In</Link>}
          {isLoaded && isSignedIn && (
            <SignOutButton>
              <button className="mlink" style={{ borderBottom:"none" }}>Sign Out</button>
            </SignOutButton>
          )}
        </div>
      )}
    </>
  );
}
