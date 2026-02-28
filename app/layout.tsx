import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/contexts/CartContext";
import { SlideCartProvider } from "@/contexts/SlideCartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import GlobalSlideCart from "@/components/GlobalSlideCart";
import OfferPopup from "@/components/OfferPopup";


export const metadata: Metadata = {
  title:{
    template: '%s - Mk Online Shop',
    default: 'Mk Online Shop',
  },
  description: "Mk Online Shop is the best online shop for all your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <body className="font-poppins antialiased">
       <AuthProvider>
       <CartProvider>
       <SlideCartProvider>
       <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        </div>
        <GlobalSlideCart />
        <OfferPopup />
        <WhatsAppButton />
       </SlideCartProvider>
       </CartProvider>
       </AuthProvider>
      </body>
    </html>
  );
}
