// src/pages/products/[id].js
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductModal from "../../components/ProductModal";
import { PRODUCTS } from "../../data/products";
import { useRef } from "react";
import dbConnect from "../../lib/dbConnect";
import ProductModel from "../../models/Product";



export async function getServerSideProps({ params }) {
  const { id } = params;

  // Normalize MongoDB product data
  const normalizeProduct = (p) => ({
    id: p._id.toString(),
    name: p.name,
    category: p.category,

    article: p.article ?? null,
    color: p.color || "",
    colorHex: p.colorHex || "#e55d6a",

    price: p.price,
    offerPrice: p.offerPrice,

    sizes: p.sizes || [],
    images: p.images || [],
    image: p.images?.[0] || "",

    badge: p.badge || "",

    details: {
      Material: p.material || "",
      heelType: p.heelType || "",
      heelHeight: p.heelHeight || "",
      color: p.color || "",
    },
  });

  // Check static products first
  const staticProduct = PRODUCTS.find(
    (p) => String(p.id) === String(id)
  );

  if (staticProduct) {
    return {
      props: {
        product: staticProduct,
        allProducts: PRODUCTS,
      },
    };
  }

  // Validate MongoDB ObjectId
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return { notFound: true };
  }

  try {
    await dbConnect();

    const dbProduct = await ProductModel.findById(id).lean();

    if (!dbProduct || !dbProduct.isActive) {
      return { notFound: true };
    }

    // Find all active products with the same article number
    const variants = dbProduct.article != null
      ? await ProductModel.find({
        article: dbProduct.article,
        isActive: true,
      }).lean()
      : [dbProduct];

    // Normalize all color variants
    const normalizedVariants = variants.map(normalizeProduct);

    // Generate color options from matching products
    const colorOptions =
      normalizedVariants.length > 1
        ? normalizedVariants.map((variant) => ({
          name: variant.color || variant.name,
          hex: variant.colorHex,
          productId: variant.id,
        }))
        : [];

    // Attach the same color options to every variant
    const allProducts = normalizedVariants.map((variant) => ({
      ...variant,
      colorOptions,
    }));

    // Current selected product
    const product = {
      ...normalizeProduct(dbProduct),
      colorOptions,
    };

    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
        allProducts: JSON.parse(JSON.stringify(allProducts)),
      },
    };

  } catch (error) {
    console.error("Product fetch error:", error);

    return { notFound: true };
  }
}

export default function ProductPage({ product, allProducts = [] }) {
  const footerRef = useRef(null);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{product.name} — POPPYPINK</title>
        <meta name="description" content={`Buy ${product.name} at ₹${product.offerPrice} — POPPYPINK`} />
        <meta property="og:title" content={`${product.name} — POPPYPINK`} />
        <meta property="og:description" content={`Buy ${product.name} at ₹${product.offerPrice}`} />
        <meta property="og:image" content={product.images?.[0] || product.image} />
        <meta property="og:url" content={`https://poppypinkshoes.com/products/${product.id}`} />
      </Head>

      <Navbar footerRef={footerRef} />

      {/* Background when modal is open */}
      <div style={{ minHeight: "100vh", background: "#FFF8F5", paddingTop: 68 }}>
        <ProductModal
          product={product}
          allProducts={allProducts}
          onClose={() => router.push("/products")}
        />
      </div>

      <Footer ref={footerRef} />
    </>
  );
}