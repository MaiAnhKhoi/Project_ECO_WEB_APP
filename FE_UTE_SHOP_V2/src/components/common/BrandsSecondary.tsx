"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import brandApi from "@/services/brandApi";
import { BrandItem } from "@/types/brand";

export default function BrandsSecondary({ parentClass = "flat-spacing-2" }) {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandApi.getBrands();
        setBrands(res.data);
      } catch (err) {
        console.error("Failed to load brands:", err);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className={parentClass}>
      <div className="container">
        <div className="infiniteslide_wrap" style={{ overflow: "hidden" }}>
          <div
            className="infiniteslide tf-brand"
            data-clone={2}
            data-style="infiniteslide17418080312321156"
            data-speed={80}
            style={{
              display: "flex",
              flexFlow: "row",
              alignItems: "center",
              animation:
                "18s linear 0s infinite normal none running infiniteslide17418080312321156",
            }}
          >
            {/* Render lần 1 */}
            {brands.map((brand) => (
              <button
                key={brand.id + "-1"}
                type="button"
                className="brand-item border-0 bg-transparent p-0"
                style={{ flex: "0 0 auto", display: "block", cursor: "pointer" }}
                onClick={() =>
                  navigate(`/shop-default?brand=${encodeURIComponent(brand.name)}`)
                }
                aria-label={`Xem sản phẩm của thương hiệu ${brand.name}`}
              >
                <img
                  alt={brand.name}
                  src={brand.imageUrl}
                  width={360}
                  height={171}
                />
              </button>
            ))}

            {/* Render lần 2 (clone) */}
            {brands.map((brand) => (
              <button
                key={brand.id + "-2"}
                type="button"
                className="brand-item infiniteslide_clone border-0 bg-transparent p-0"
                style={{ flex: "0 0 auto", display: "block", cursor: "pointer" }}
                onClick={() =>
                  navigate(`/shop-default?brand=${encodeURIComponent(brand.name)}`)
                }
                aria-label={`Xem sản phẩm của thương hiệu ${brand.name}`}
              >
                <img
                  alt={brand.name}
                  src={brand.imageUrl}
                  width={360}
                  height={171}
                />
              </button>
            ))}

            {/* Render lần 3 (clone) */}
            {brands.map((brand) => (
              <button
                key={brand.id + "-3"}
                type="button"
                className="brand-item infiniteslide_clone border-0 bg-transparent p-0"
                style={{ flex: "0 0 auto", display: "block", cursor: "pointer" }}
                onClick={() =>
                  navigate(`/shop-default?brand=${encodeURIComponent(brand.name)}`)
                }
                aria-label={`Xem sản phẩm của thương hiệu ${brand.name}`}
              >
                <img
                  alt={brand.name}
                  src={brand.imageUrl}
                  width={360}
                  height={171}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
