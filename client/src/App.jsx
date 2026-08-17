import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppWidget from "./components/WhatsAppWidget";
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
            <WhatsAppWidget phone="16132613210" message="Hi, I saw your site and would like to know more." />
        </>
    );
}

export default App;
