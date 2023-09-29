import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CartProvider } from "./context/CartProvider.tsx";
import { ProductsProvider } from "./context/ProductProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    
        <App />

  </React.StrictMode>
);