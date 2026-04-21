"use client";

import { useEffect, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

export default function Toast({ 
  message, 
  type = "info", 
  duration = 3000,
  onClose 
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const typeStyles = {
    success: {
      bg: "bg-success",
      icon: "✓",
      text: "text-white"
    },
    error: {
      bg: "bg-danger",
      icon: "✕",
      text: "text-white"
    },
    info: {
      bg: "bg-info",
      icon: "ℹ",
      text: "text-white"
    },
    warning: {
      bg: "bg-warning",
      icon: "⚠",
      text: "text-dark"
    }
  };

  const style = typeStyles[type];

  return (
    <div
      className={`toast-notification ${style.bg} ${style.text} shadow-lg`}
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        minWidth: "300px",
        maxWidth: "400px",
        padding: "16px 20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        animation: "slideInRight 0.3s ease-out",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease-out"
      }}
    >
      <span style={{ fontSize: "20px", fontWeight: "bold" }}>{style.icon}</span>
      <span style={{ flex: 1, fontSize: "14px", lineHeight: "1.5" }}>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        style={{
          background: "transparent",
          border: "none",
          color: "inherit",
          fontSize: "20px",
          cursor: "pointer",
          padding: "0",
          marginLeft: "8px",
          opacity: 0.8
        }}
        aria-label="Close"
      >
        ×
      </button>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Hook để quản lý toast
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: ToastType }>>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const ToastContainer = () => (
    <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999 }}>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ marginBottom: index > 0 ? "10px" : "0" }}>
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );

  return { showToast, ToastContainer };
}

