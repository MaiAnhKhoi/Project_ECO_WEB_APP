"use client";
import { useState } from "react";
import type { BoughtTogetherProduct } from "@/types";
import { formatPrice } from "@/utils/formatPrice";

export default function BoughtTogether() {
  const products: BoughtTogetherProduct[] = [
    {
      id: 1,
      title: "Single Breasted Blazer",
      image: "/images/products/fashion/women-black-1.jpg",
      price: 100.0,
      oldPrice: 120.0,
      options: [
        "Black / S",
        "Black / M",
        "Black / L",
        "Blue / S",
        "Blue / M",
        "Blue / L",
        "Blue / XL",
        "White / S",
        "White / M",
        "White / L",
      ],
      checked: true,
    },
    {
      id: 2,
      title: "Short Sleeve Sweat",
      image: "/images/products/fashion/women-grey-3.jpg",
      price: 230.0,
      oldPrice: 250.0,
      options: [
        "White / S",
        "White / M",
        "White / L",
        "Black / M",
        "Black / L",
        "Blue / S",
        "Blue / M",
        "Blue / L",
        "Blue / XL",
      ],
      checked: false,
    },
    {
      id: 3,
      title: "One Shoulder Velvet T-Shirt",
      image: "/images/products/fashion/women-black-6.jpg",
      price: 200.0,
      oldPrice: 220.0,
      options: [
        "Black / S",
        "Black / M",
        "Black / L",
        "Blue / S",
        "Blue / M",
        "Blue / L",
        "Blue / XL",
        "White / S",
        "White / M",
        "White / L",
      ],
      checked: false,
    },
  ];

  const [selectedProducts, setSelectedProducts] = useState(products);

  const toggleCheckbox = (id: number) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, checked: !product.checked } : product
      )
    );
  };

  // Calculate total price dynamically (convert USD to VND: 1 USD = 24000 VND)
  const totalPrice = selectedProducts
    .filter((product) => product.checked)
    .reduce((sum, product) => sum + product.price * 24000, 0);

  const totalOldPrice = selectedProducts
    .filter((product) => product.checked)
    .reduce((sum, product) => sum + product.oldPrice * 24000, 0);

  return (
    <form
      className="tf-product-form-bundle"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="tf-bundle-products">
        {selectedProducts.map((product) => (
          <div
            key={product.id}
            className={`tf-bundle-product-item item-has-checkbox ${
              product.checked ? "check" : ""
            }`}
          >
            <div className="bundle-check">
              <input
                type="checkbox"
                className="tf-check"
                checked={product.checked}
                onChange={() => toggleCheckbox(product.id)}
              />
            </div>
            <a href="#" className="bundle-image">
              <img
                alt="img-product"
                src={product.image}
                width={828}
                height={1241}
              />
            </a>
            <div className="bundle-info">
              <div className="bundle-title text-sm fw-medium">
                {product.title}
              </div>
              <div className="bundle-price text-md fw-medium">
                <span className="new-price">{formatPrice(product.price * 24000)}</span>{" "}
                <span className="old-price">
                  {formatPrice(product.oldPrice * 24000)}
                </span>
              </div>
              <div className="bundle-variant tf-select">
                <select>
                  {product.options.map((option, index) => (
                    <option key={index}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bundle-total-submit">
        <div className="text">Tổng giá:</div>
        <span className="total-price">{formatPrice(totalPrice)}</span>{" "}
        <span className="total-price-old">{formatPrice(totalOldPrice)}</span>
      </div>
      <button className="btn-submit-total tf-btn btn-out-line-primary">
        Thêm các sản phẩm đã chọn vào giỏ
      </button>
    </form>
  );
}
