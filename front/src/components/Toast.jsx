import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import useToastStore from "../store/toastStore";

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colorMap = {
  success: "bg-success",
  error: "bg-error",
  info: "bg-primary",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type] || Info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto flex items-center gap-3 bg-white px-5 py-3.5 rounded-xl shadow-elevated border border-outline-variant/20 min-w-[280px]"
            >
              <div
                className={`w-8 h-8 rounded-lg ${
                  colorMap[toast.type]
                } flex items-center justify-center flex-shrink-0`}
              >
                <Icon size={16} className="text-white" />
              </div>
              <p className="text-body-sm font-medium text-on-surface flex-1">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-md hover:bg-surface-container transition-colors flex-shrink-0"
                aria-label="Dismiss notification"
              >
                <X size={14} className="text-outline" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
