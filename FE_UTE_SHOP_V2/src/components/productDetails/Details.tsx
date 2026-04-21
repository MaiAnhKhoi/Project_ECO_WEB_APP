// src/components/productDetails/Details1.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Slider from "./Slider";
import { Link } from "react-router-dom";

import ColorSelect from "./ColorSelect";
import SizePicker from "./SizeSelect";
import { useContextElement } from "@/context/Context";
import QuantitySelect from "../common/QuantitySelect";
import StickyProducts from "./StickyProducts";
import ProductHeading from "./ProductHeading";
import { resolveColorHex } from "@/utils/color";
import VirtualTryOnModal from "../modals/VirtualTryOnModal";

import type { DetailsProps } from "@/types";
import type { ProductColor } from "@/types/product";
import type { Size } from "@/types/components";

export default function Details1({ product }: DetailsProps) {
  const {
    addProductToCart,
    isAddedToCartProducts,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
    cartProducts,
    updateQuantity,
  } = useContextElement();

  const [quantity, setQuantity] = useState(1);
  const [showTryOn, setShowTryOn] = useState(false);

  const nameLower = (
    (product.title || (product as any).name || "") as string
  ).toLowerCase();

  // Chặn thử đồ với phụ kiện
  const isAccessory = useMemo(() => {
    const deny = [
      "giày",
      "giay",
      "sandal",
      "dép",
      "dep",
      "boot",
      "sneaker",
      "loafer",
      "oxford",
      "heel",
      "pump",
      "slipper",
      "flip-flop",
      "ring",
      "nhẫn",
      "bracelet",
      "vòng",
      "necklace",
      "dây chuyền",
      "earring",
      "bông tai",
      "trang sức",
      "jewelry",
      "jewellery",
      "belt",
      "thắt lưng",
      "ví",
      "balo",
      "túi",
      "bag",
      "cap",
      "hat",
      "mũ",
      "nón",
      "kính",
      "khăn",
    ];
    return deny.some((k) => nameLower.includes(k));
  }, [nameLower]);

  const isSetProduct = useMemo(() => {
    const keywords = ["bộ", "set ", "set-"];
    return keywords.some((k) => nameLower.includes(k));
  }, [nameLower]);

  // ⭐ Map colors từ BE sang ProductColor đúng format
  const mappedColors: ProductColor[] = useMemo(() => {
    if (!product.colors || product.colors.length === 0) {
      console.warn("Product has no colors", product);
      return [];
    }
    
    // Debug: log để xem BE trả về gì
    console.log("Product colors from BE:", product.colors);
    
    return product.colors.map((c: any) => {
      // BE trả về: { label, value (css class), img, sizes }
      // Có thể BE trả về nested object hoặc flat object
      const label = c.label || c.name || "";
      const cssClass = c.value || c.colorCssClass || null;
      const img = c.img || c.imageSrc || null;
      
      // Luôn dùng resolveColorHex để suy ra hex từ label nếu không có hex
      const colorHex = resolveColorHex({
        hex: c.colorHex || c.hex || null,
        cssClass: cssClass,
        fallbackName: label,
      });

      console.log(`Color mapping: label="${label}", cssClass="${cssClass}", hex="${colorHex}"`);

      return {
        label: label,
        value: cssClass,
        img: img,
        colorHex: colorHex,
        colorCssClass: cssClass,
        hex: colorHex,
        sizes: (c.sizes || []).map((s: any) => ({
          size: s.size || s.label || "",
          inStock: s.inStock ?? false,
          variantId: s.variantId || 0,
          stockQuantity: s.stockQuantity || 0,
        })),
      };
    });
  }, [product.colors]);

  const [activeColor, setActiveColor] = useState(
    mappedColors?.[0]?.label || ""
  );

  const sizesForCurrentColor: Size[] = useMemo(() => {
    const selectedColor = mappedColors.find(
      (c) => c.label === activeColor
    );
    if (!selectedColor || !selectedColor.sizes) return [];

    return selectedColor.sizes.map((s) => ({
      label: s.size,
      value: s.size.toLowerCase(),
      display: s.size,
      inStock: s.inStock,
      variantId: s.variantId,
      stockQuantity: s.stockQuantity,
    }));
  }, [mappedColors, activeColor]);

  const [selectedSize, setSelectedSize] = useState(
    sizesForCurrentColor?.[0]?.value || ""
  );

  const currentVariant = useMemo(() => {
    const colorObj = mappedColors.find(
      (c) => c.label === activeColor
    );
    if (!colorObj || !colorObj.sizes) return null;

    return (
      colorObj.sizes.find(
        (s) => s.size.toLowerCase() === selectedSize
      ) || null
    );
  }, [mappedColors, activeColor, selectedSize]);

  const handleSetQuantity = (qty: number) => {
    if (!currentVariant) {
      alert("Vui lòng chọn màu và size.");
      return;
    }

    const stock = currentVariant.stockQuantity ?? 0;

    if (stock <= 0) {
      alert("Sản phẩm này hiện đã hết hàng.");
      return;
    }

    if (qty > stock) {
      alert(`Chỉ còn ${stock} sản phẩm trong kho`);
      qty = stock;
    }

    if (qty < 1) qty = 1;

    const cartItem = cartProducts.find(
      (p) =>
        p.productId === product.id &&
        (currentVariant.variantId == null ||
          p.variantId === currentVariant.variantId)
    );

    if (cartItem) {
      updateQuantity(cartItem.id, qty); // ✅ dùng itemId
    } else {
      setQuantity(qty);
    }
  };

  useEffect(() => {
    if (sizesForCurrentColor.length > 0) {
      setSelectedSize(sizesForCurrentColor[0].value);
    }
  }, [activeColor, sizesForCurrentColor]);

  return (
    <section className="flat-single-product">
      <div className="tf-main-product section-image-zoom">
        <div className="container">
          <div className="row">
            {/* ------------------ PRODUCT IMAGES ------------------ */}
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top">
                <div className="product-thumbs-slider">
                  <Slider
                    firstItem={
                      mappedColors.find(
                        (c) => c.label === activeColor
                      )?.img ?? product.imgSrc
                    }
                    activeColor={activeColor}
                    setActiveColor={setActiveColor}
                    slideItems={mappedColors.map((c, index) => ({
                      id: index + 1,
                      color: c.label,
                      size: "",
                      imgSrc: c.img || product.imgSrc,
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* ------------------ PRODUCT INFO ------------------ */}
            <div className="col-md-6">
              <div className="tf-zoom-main" />
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-product-info-list other-image-zoom">
                  <ProductHeading product={product} showProgress={true} />

                  <div className="tf-product-variant">
                    {/* 🔥 COLOR SELECT */}
                    <ColorSelect
                      setActiveColor={setActiveColor}
                      activeColor={activeColor}
                      colorOptions={mappedColors}
                    />

                    {/* 🔥 SIZE SELECT (THEO MÀU) */}
                    <SizePicker
                      sizes={sizesForCurrentColor}
                      activeSize={selectedSize}
                      setActiveSize={setSelectedSize}
                    />
                  </div>

                  <div className="tf-product-total-quantity">
                    <div className="group-btn">
                      <QuantitySelect
                        quantity={
                          isAddedToCartProducts(product.id)
                            ? cartProducts.find(
                                (p) => p.id === product.id
                              )?.quantity ?? quantity
                            : quantity
                        }
                        setQuantity={handleSetQuantity}
                        max={
                          currentVariant?.stockQuantity ?? 0
                        }
                      />

                      <a
                        href="#shoppingCart"
                        data-bs-toggle="offcanvas"
                        onClick={() => {
                                      if (!currentVariant) {
                                        alert("Vui lòng chọn màu và size.");
                                        return;
                                      }

                                      addProductToCart(
                                        product.id,
                                        quantity,
                                        true,
                                        currentVariant.variantId,
                                        activeColor               
                                      );
                                    }}
                        className="tf-btn hover-primary btn-add-to-cart"
                      >
                        {isAddedToCartProducts(product.id)
                          ? "Đã thêm vào giỏ"
                          : "Thêm vào giỏ"}
                      </a>
                    </div>

                  <button
                    type="button"
                    className="tf-btn btn-primary w-100 animate-btn mt-2"
                    disabled={isAccessory}
                    onClick={() => {
                      if (isAccessory) {
                        alert("Thử đồ ảo chỉ áp dụng cho trang phục (áo, quần, váy/đầm).");
                        return;
                      }
                      setShowTryOn(true);
                    }}
                  >
                    Thử đồ ảo
                  </button>
                  {isAccessory && (
                    <div className="text-danger mt-1" style={{ fontSize: "13px" }}>
                      Tính năng thử đồ ảo chỉ hỗ trợ trang phục (áo, quần, váy/đầm).
                    </div>
                  )}

                  <Link
                    to="/checkout"
                    className="tf-btn btn-primary w-100 animate-btn mt-2"
                  >
                    Mua ngay
                  </Link>

                  </div>

                  {/* Wishlist + Compare + Share */}
                  <div className="tf-product-extra-link">
                    <a
                      onClick={() => addToWishlist(product.id)}
                      className={`product-extra-icon link btn-add-wishlist ${
                        isAddedtoWishlist(product.id)
                          ? "added-wishlist"
                          : ""
                      }`}
                    >
                      <i className="icon add icon-heart" />
                      <span className="add">Thêm vào yêu thích</span>
                      <i className="icon added icon-trash" />
                      <span className="added">Xóa khỏi yêu thích</span>
                    </a>

                    <a
                      href="#compare"
                      data-bs-toggle="modal"
                      onClick={() => addToCompareItem(product.id)}
                      className="product-extra-icon link"
                    >
                      <i className="icon icon-compare2" />
                      {isAddedtoCompareItem(product.id)
                        ? "Đã so sánh"
                        : "Thêm vào so sánh"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ Sticky bar dùng chính product hiện tại */}
      <StickyProducts product={product} />

      {/* Virtual Try-On Modal */}
      <VirtualTryOnModal
        isOpen={showTryOn}
        onClose={() => setShowTryOn(false)}
        product={product}
        isSupported={!isAccessory}
        isSetProduct={isSetProduct}
      />
    </section>
  );
}
