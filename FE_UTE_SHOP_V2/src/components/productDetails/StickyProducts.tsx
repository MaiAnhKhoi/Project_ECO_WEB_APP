// src/components/productDetails/StickyProducts.tsx
"use client";

import { useContextElement } from "@/context/Context";
import { useEffect, useState, useMemo } from "react";
import QuantitySelect from "../common/QuantitySelect";
import { formatPrice } from "@/utils/formatPrice";
import type { Product } from "@/types/product";

type StickyProductsProps = {
  product: Product;
};

export default function StickyProducts({ product }: StickyProductsProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const myElement = document.querySelector(".tf-sticky-btn-atc");

      if (myElement) {
        if (scrollPosition >= 500) {
          myElement.classList.add("show");
        } else {
          myElement.classList.remove("show");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const {
    addProductToCart,
    isAddedToCartProducts,
    cartProducts,
    updateQuantity,
  } = useContextElement();

  // 🔹 Tạo list option từ màu + size của product (nếu có)
  const variantOptions = useMemo(() => {
    const basePrice = product.basePrice ?? product.price ?? 0;

    if (!product.colors || product.colors.length === 0) {
      return [
        `Default - ${formatPrice(basePrice)}`,
      ];
    }

    const options: string[] = [];

    product.colors.forEach((color) => {
      color.sizes?.forEach((s) => {
        options.push(
          `${color.label} / ${s.size} - ${formatPrice(basePrice)}`
        );
      });
    });

    return options.length > 0
      ? options
      : [`Default - ${formatPrice(basePrice)}`];
  }, [product]);

  const currentCartQty = isAddedToCartProducts(product.id)
    ? cartProducts.find((p) => p.id === product.id)?.quantity ?? quantity
    : quantity;

  return (
    <div className="tf-sticky-btn-atc">
      <div className="container">
        <div className="tf-height-observer w-100 d-flex align-items-center">
          <div className="tf-sticky-atc-product d-flex align-items-center">
            <div className="tf-sticky-atc-img">
              <img
                className="lazyload"
                alt={product.name || product.title || ""}
                src={product.imgSrc}
                width={828}
                height={1241}
              />
            </div>
            <div className="tf-sticky-atc-title fw-5 d-xl-block d-none">
              {product.name || product.title}
            </div>
          </div>

          <div className="tf-sticky-atc-infos">
            <form>
              <div className="tf-sticky-atc-variant-price text-center tf-select">
                <select>
                  {variantOptions.map((opt, idx) => (
                    <option key={idx}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="tf-sticky-atc-btns">
                <div className="tf-product-info-quantity">
                  <QuantitySelect
                    quantity={currentCartQty}
                    setQuantity={(qty) => {
                      if (isAddedToCartProducts(product.id)) {
                        updateQuantity(product.id, qty);
                      } else {
                        setQuantity(qty);
                      }
                    }}
                  />
                </div>

                <a
                  href="#shoppingCart"
                  data-bs-toggle="offcanvas"
                  onClick={() => addProductToCart(product.id, currentCartQty)}
                  className="tf-btn animate-btn d-inline-flex justify-content-center"
                >
                  {isAddedToCartProducts(product.id)
                    ? "Already Added"
                    : "Add to cart"}
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
