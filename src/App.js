import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import TrainDetail from "./pages/TrainDetail";
import Cart from "./pages/Cart";
import Confirmation from "./pages/Confirmation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function App() {
  const [cart, setCart] = useLocalStorage("railpk_cart", []);

  function addToCart(booking) {
    setCart((prev) => [...prev, booking]);
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((b) => b.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <BrowserRouter>
      <Navbar cartCount={cart.length} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/train/:id" element={<TrainDetail onAddToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} onRemove={removeFromCart} onClearCart={clearCart} />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={
            <div className="container" style={{ padding: "80px 20px" }}>
              <div className="state-box">
                <h3>Page not found</h3>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
