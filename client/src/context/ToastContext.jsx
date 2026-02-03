// client/src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

const ToastContext = createContext();

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    timers.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timers.current[id];
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  useEffect(() => {
    return () => Object.values(timers.current).forEach(clearTimeout);
  }, []);

  const value = { showToast, removeToast };

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="toast-container" aria-live="polite" role="status">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            onMouseEnter={() => {
              if (timers.current[toast.id]) clearTimeout(timers.current[toast.id]);
            }}
            onMouseLeave={() => {
              timers.current[toast.id] = setTimeout(() => removeToast(toast.id), 3000);
            }}
          >
            {toast.message}
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
