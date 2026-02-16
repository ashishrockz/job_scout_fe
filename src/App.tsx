import React from "react";
import { Toaster } from "@/components/toaster";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/header";

export interface AppProps {
  children: React.ReactNode;
}

const App = ({ children }: AppProps) => {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-gray-50">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Toast Notifications */}
        <Toaster position="bottom-right" />
      </div>
    </AuthProvider>
  );
};

export default App;
