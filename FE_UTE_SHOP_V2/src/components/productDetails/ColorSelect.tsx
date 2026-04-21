"use client";

import { useState, Fragment, useMemo } from "react";
import type { ProductColor, ColorOption } from "@/types";
import { resolveColorHex } from "@/utils/color";

export default function ColorSelect({
  activeColor = "",
  setActiveColor,
  colorOptions = [], // ProductColor[]
}: {
  activeColor?: string;
  setActiveColor?: (value: string) => void;
  colorOptions?: ProductColor[];
}) {
  const [activeColorDefault, setActiveColorDefault] = useState<string>("");

  // ⭐ Map về ColorOption với hex color để dùng inline style
  const options: ColorOption[] = useMemo(() => {
    return colorOptions.map((c, index) => {
      // Luôn dùng resolveColorHex để suy ra hex color từ mọi nguồn có thể
      const colorHex = resolveColorHex({
        hex: c.colorHex || c.hex || null,
        cssClass: c.value || c.colorCssClass || null,
        fallbackName: c.label || null,
      });

      return {
        id: `color-${index}`,
        value: c.label || "",      // tên màu để hiển thị
        color: "",                 // không dùng css class nữa
        colorHex: colorHex,        // hex để dùng inline style
      };
    });
  }, [colorOptions]);

  const handleSelectColor = (value: string) => {
    if (setActiveColor) setActiveColor(value);
    else setActiveColorDefault(value);
  };

  const currentColor =
    activeColor ||
    activeColorDefault ||
    options[0]?.value ||
    "";

  return (
    <div className="variant-picker-item variant-color">
      <div className="variant-picker-label">
        Colors:
        <span
          className="text-title variant-picker-label-value value-currentColor"
          style={{ textTransform: "capitalize" }}
        >
          {currentColor}
        </span>
      </div>

      <div className="variant-picker-values">
        {options.map(({ id, value, colorHex }) => (
          <Fragment key={id}>
            <label
              onClick={() => handleSelectColor(value)}
              className={`hover-tooltip tooltip-bot color-btn ${
                currentColor === value ? "active" : ""
              }`}
              htmlFor={id}
            >
              <span
                className="check-color"
                style={{
                  backgroundColor: colorHex || "#cccccc",
                }}
              />
              <span className="tooltip">{value}</span>
            </label>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
