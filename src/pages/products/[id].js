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

  // Check static products first
  const staticProduct = PRODUCTS.find(
    p => String(p.id) === String(id)
  );

  if (staticProduct) {
    return { props: { product: staticProduct } };
  }

  // Fetch product from MongoDB
  try {
    await dbConnect();

    // Validate MongoDB ObjectId
    if (!/^[a-f\d]{24}$/i.test(id)) {
      return { notFound: true };
    }

    const dbProduct = await ProductModel.findById(id).lean();

    if (!dbProduct || !dbProduct.isActive) {
      return { notFound: true };
    }

    const product = {
      id: dbProduct._id.toString(),
      name: dbProduct.name,
      category: dbProduct.category,

      // Product information
      article: dbProduct.article || null,
      color: dbProduct.color || "",
      colorHex: dbProduct.colorHex || "#e55d6a",

      // Pricing
      price: dbProduct.price,
      offerPrice: dbProduct.offerPrice,

      // Images and sizes
      sizes: dbProduct.sizes || [],
      images: dbProduct.images || [],
      image: dbProduct.images?.[0] || "",

      // Additional information
      badge: dbProduct.badge || "",
      colorOptions: dbProduct.colorOptions || [],

      // Product Details Accordion
      details: {
        Material: dbProduct.material || "",
        heelType: dbProduct.heelType || "",
        heelHeight: dbProduct.heelHeight || "",
        color: dbProduct.color || "",
      },
    };

    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
      },
    };

  } catch (error) {
    console.error(
      "Product fetch error:",
      error.message
    );

    return { notFound: true };
  }
}


export default function ProductPage({ product }) {
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
                    onClose={() => router.push("/products")}
                />
            </div>

            <Footer ref={footerRef} />
        </>
    );
}