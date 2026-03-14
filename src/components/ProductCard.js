// src/components/ProductCard.js
import { useState } from "react";
import { useCart } from "../context/CartContext";
import ProductModal from "./ProductModal";

export default function ProductCard({ product, index = 0 }) {
  const [wished, setWished] = useState(false);
  const [modal,  setModal]  = useState(false);

  const imgs     = product.images || [product.image];
  const discount = Math.round((1 - product.offerPrice / product.price) * 100);

  return (
    <>
      <style>{`
        .pp-card {
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 3px;
          overflow: visible;
          cursor: pointer;
          position: relative;
          font-family: 'DM Sans', sans-serif;
          transition: box-shadow 0.2s;
        }
        .pp-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.11);
        }

        /* Image */
        .pp-img-wrap {
          position: relative;
          background: #f4efed;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          border-radius: 3px 3px 0 0;
        }
        .pp-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 0.4s ease;
        }
        .pp-card:hover .pp-img { transform: scale(1.05); }

        /* Badges */
        .pp-off {
          position: absolute; top: 0; left: 0;
          background: #c8102e; color: #fff;
          font-size: 10px; font-weight: 700;
          padding: 3px 7px;
          letter-spacing: 0.02em;
          z-index: 2;
        }
        .pp-rating {
          position: absolute; bottom: 6px; left: 6px;
          background: #c8102e; color: #fff;
          font-size: 10px; font-weight: 700;
          padding: 2px 6px; border-radius: 2px;
          display: flex; align-items: center; gap: 2px;
          z-index: 2;
        }

        /* Icon buttons */
        .pp-icon-btn {
          position: absolute; top: 6px;
          width: 30px; height: 30px; border-radius: 50%;
          background: #fff; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 3;
          box-shadow: 0 1px 6px rgba(0,0,0,0.13);
          transition: background 0.18s;
        }
        .pp-icon-btn:hover { background: #f5f5f5; }
        .pp-wish { right: 6px; }
        .pp-wish.wished { background: #e55d6a; }
        .pp-view { right: 42px; }

        /* Card body */
        .pp-body {
          padding: 8px 9px 10px;
        }
        .pp-brand {
          font-size: 10px; font-weight: 700;
          color: #999; letter-spacing: 0.05em;
          text-transform: uppercase; margin-bottom: 1px;
        }
        .pp-name {
          font-size: 12px; font-weight: 600;
          color: #1a1a1a; line-height: 1.3;
          margin-bottom: 5px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pp-price-row {
          display: flex; align-items: center;
          gap: 5px; margin-bottom: 5px;
        }
        .pp-offer { font-size: 13px; font-weight: 700; color: #1a1a1a; }
        .pp-orig  { font-size: 11px; color: #bbb; text-decoration: line-through; }
        .pp-color-row {
          display: flex; align-items: center; gap: 4px;
        }
        .pp-dot {
          width: 11px; height: 11px; border-radius: 50%;
          border: 1.5px solid rgba(0,0,0,0.13);
          flex-shrink: 0;
        }
        .pp-color-count { font-size: 10px; color: #888; }

        /* 2-col mobile grid — put this in products.js too */
        @media (max-width: 640px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
        }

        @keyframes ppUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .pp-anim { animation: ppUp 0.35s ease both; }
      `}</style>

      <div
        className="pp-card pp-anim"
        style={{ animationDelay: `${Math.min(index, 10) * 0.04}s` }}
        onClick={() => setModal(true)}
      >
        {/* Image */}
        <div className="pp-img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgs[0]} alt={product.name} className="pp-img" />

          {discount > 0 && <div className="pp-off">{discount}% OFF</div>}
          {product.rating && (
            <div className="pp-rating">{product.rating} ★</div>
          )}

          {/* Wishlist */}
          <button
            className={`pp-icon-btn pp-wish${wished ? " wished" : ""}`}
            onClick={e => { e.stopPropagation(); setWished(w => !w); }}
            title="Wishlist"
          >
            <svg width="13" height="13" fill={wished ? "#fff" : "none"} stroke={wished ? "#fff" : "#777"} strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {/* Quick view */}
          <button
            className="pp-icon-btn pp-view"
            onClick={e => { e.stopPropagation(); setModal(true); }}
            title="Quick View"
          >
            <svg width="12" height="12" fill="none" stroke="#777" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="pp-body">
          <div className="pp-brand">POPPYPINK</div>
          <div className="pp-name">{product.name}</div>
          <div className="pp-price-row">
            <span className="pp-offer">₹{product.offerPrice.toLocaleString()}</span>
            {product.price > product.offerPrice && (
              <span className="pp-orig">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          {product.colorOptions?.length > 0 && (
            <div className="pp-color-row">
              {product.colorOptions.slice(0, 4).map(c => (
                <div key={c.hex} className="pp-dot" style={{ background: c.hex }} title={c.name} />
              ))}
              {product.colorOptions.length > 1 && (
                <span className="pp-color-count">{product.colorOptions.length} colors</span>
              )}
            </div>
          )}
        </div>
      </div>

      {modal && <ProductModal product={product} onClose={() => setModal(false)} />}
    </>
  );
}