import type { Metadata } from "next";
import "./globals.css";
import { AuthContextProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Speedobits",
  description: "Speedobits  - The ultimate coding platform for coding enthusiasts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <Toaster />
          <Navbar />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
