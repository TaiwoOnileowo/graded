"use client";

import { ToastContainer } from "react-toastify";

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName={(context) =>
          context?.type === "success"
            ? "toast-success-class"
            : context?.type === "error"
            ? "toast-error-class"
            : ""
        }
      />
      {children}
    </>
  );
};
export default ToastProvider;
