'use client';

import { Phone } from "lucide-react";
import { SITE_NAME } from "@/lib/branding";

const FloatingCallButton = () => {
  const handleCall = () => {
    window.open('tel:+237683577676', '_self');
  };

  return (
    <button
      onClick={handleCall}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-pulse"
      aria-label={`Call ${SITE_NAME}`}
      title="Call +237 6 83 57 76 76"
    >
      <Phone className="h-6 w-6" />
    </button>
  );
};

export default FloatingCallButton;
