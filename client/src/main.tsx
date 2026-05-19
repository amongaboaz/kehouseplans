/**
 * App entry — providers for auth, cart, theme, and routing.
 */
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./providers/ThemeProvider"
import App from "./App"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
)
