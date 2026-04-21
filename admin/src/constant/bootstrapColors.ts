export interface ColorOption {
    label: string;      // tên hiển thị
    cssClass: string;   // bg-primary, bg-primary-100...
    hex: string;        // mã màu
}

/**
 * FULL Bootstrap 5.3 Color Palette
 * Bao gồm:
 * - các màu cơ bản: primary, secondary, success...
 * - các sắc độ từ 100 -> 900
 */

export const BOOTSTRAP_COLORS: ColorOption[] = [
    // PRIMARY
    { label: "Primary", cssClass: "bg-primary", hex: "#0d6efd" },
    { label: "Primary 100", cssClass: "bg-primary-100", hex: "#cfe2ff" },
    { label: "Primary 200", cssClass: "bg-primary-200", hex: "#9ec5fe" },
    { label: "Primary 300", cssClass: "bg-primary-300", hex: "#6ea8fe" },
    { label: "Primary 400", cssClass: "bg-primary-400", hex: "#3d8bfd" },
    { label: "Primary 500", cssClass: "bg-primary-500", hex: "#0d6efd" },
    { label: "Primary 600", cssClass: "bg-primary-600", hex: "#0a58ca" },
    { label: "Primary 700", cssClass: "bg-primary-700", hex: "#084298" },
    { label: "Primary 800", cssClass: "bg-primary-800", hex: "#052c65" },
    { label: "Primary 900", cssClass: "bg-primary-900", hex: "#031633" },

    // SECONDARY
    { label: "Secondary", cssClass: "bg-secondary", hex: "#6c757d" },
    { label: "Secondary 100", cssClass: "bg-secondary-100", hex: "#e2e3e5" },
    { label: "Secondary 200", cssClass: "bg-secondary-200", hex: "#c4c8cb" },
    { label: "Secondary 300", cssClass: "bg-secondary-300", hex: "#a6acb2" },
    { label: "Secondary 400", cssClass: "bg-secondary-400", hex: "#888f99" },
    { label: "Secondary 500", cssClass: "bg-secondary-500", hex: "#6c757d" },
    { label: "Secondary 600", cssClass: "bg-secondary-600", hex: "#565e64" },
    { label: "Secondary 700", cssClass: "bg-secondary-700", hex: "#3f4449" },
    { label: "Secondary 800", cssClass: "bg-secondary-800", hex: "#292d31" },
    { label: "Secondary 900", cssClass: "bg-secondary-900", hex: "#131517" },

    // SUCCESS
    { label: "Success", cssClass: "bg-success", hex: "#198754" },
    { label: "Success 100", cssClass: "bg-success-100", hex: "#d1e7dd" },
    { label: "Success 200", cssClass: "bg-success-200", hex: "#a3cfbb" },
    { label: "Success 300", cssClass: "bg-success-300", hex: "#75b798" },
    { label: "Success 400", cssClass: "bg-success-400", hex: "#479f76" },
    { label: "Success 500", cssClass: "bg-success-500", hex: "#198754" },
    { label: "Success 600", cssClass: "bg-success-600", hex: "#146c43" },
    { label: "Success 700", cssClass: "bg-success-700", hex: "#0f5132" },
    { label: "Success 800", cssClass: "bg-success-800", hex: "#0a3721" },
    { label: "Success 900", cssClass: "bg-success-900", hex: "#051c11" },

    // DANGER
    { label: "Danger", cssClass: "bg-danger", hex: "#dc3545" },
    { label: "Danger 100", cssClass: "bg-danger-100", hex: "#f8d7da" },
    { label: "Danger 200", cssClass: "bg-danger-200", hex: "#f1aeb5" },
    { label: "Danger 300", cssClass: "bg-danger-300", hex: "#ea868f" },
    { label: "Danger 400", cssClass: "bg-danger-400", hex: "#e35d6a" },
    { label: "Danger 500", cssClass: "bg-danger-500", hex: "#dc3545" },
    { label: "Danger 600", cssClass: "bg-danger-600", hex: "#b02a37" },
    { label: "Danger 700", cssClass: "bg-danger-700", hex: "#842029" },
    { label: "Danger 800", cssClass: "bg-danger-800", hex: "#58151c" },
    { label: "Danger 900", cssClass: "bg-danger-900", hex: "#2c0b0e" },

    // WARNING
    { label: "Warning", cssClass: "bg-warning", hex: "#ffc107" },
    { label: "Warning 100", cssClass: "bg-warning-100", hex: "#fff3cd" },
    { label: "Warning 200", cssClass: "bg-warning-200", hex: "#ffe69c" },
    { label: "Warning 300", cssClass: "bg-warning-300", hex: "#ffda6a" },
    { label: "Warning 400", cssClass: "bg-warning-400", hex: "#ffcd39" },
    { label: "Warning 500", cssClass: "bg-warning-500", hex: "#ffc107" },
    { label: "Warning 600", cssClass: "bg-warning-600", hex: "#cc9a06" },
    { label: "Warning 700", cssClass: "bg-warning-700", hex: "#997404" },
    { label: "Warning 800", cssClass: "bg-warning-800", hex: "#664d03" },
    { label: "Warning 900", cssClass: "bg-warning-900", hex: "#332701" },

    // INFO
    { label: "Info", cssClass: "bg-info", hex: "#0dcaf0" },
    { label: "Info 100", cssClass: "bg-info-100", hex: "#cff4fc" },
    { label: "Info 200", cssClass: "bg-info-200", hex: "#9eeaf9" },
    { label: "Info 300", cssClass: "bg-info-300", hex: "#6edff6" },
    { label: "Info 400", cssClass: "bg-info-400", hex: "#3dd5f3" },
    { label: "Info 500", cssClass: "bg-info-500", hex: "#0dcaf0" },
    { label: "Info 600", cssClass: "bg-info-600", hex: "#0aa2c0" },
    { label: "Info 700", cssClass: "bg-info-700", hex: "#087990" },
    { label: "Info 800", cssClass: "bg-info-800", hex: "#055160" },
    { label: "Info 900", cssClass: "bg-info-900", hex: "#032830" },

    // LIGHT
    { label: "Light", cssClass: "bg-light", hex: "#f8f9fa" },

    // DARK
    { label: "Dark", cssClass: "bg-dark", hex: "#212529" },

    // WHITE & BLACK
    { label: "White", cssClass: "bg-white", hex: "#ffffff" },
    { label: "Black", cssClass: "bg-black", hex: "#000000" },
];
