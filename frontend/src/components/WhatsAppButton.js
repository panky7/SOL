import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/33689844778"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 group"
      data-testid="whatsapp-float-button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
      <span className="absolute -top-12 right-0 bg-[#03045E] text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
        WhatsApp
      </span>
    </motion.a>
  );
};

export default WhatsAppButton;
