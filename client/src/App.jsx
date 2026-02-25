import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <ScrollToTop />
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
}

export default App;
