import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const Feature: React.FC<FeatureProps> = ({ icon: Icon, title, description }) => (
  <motion.div
    className="flex flex-col items-center text-center p-4"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-4 mb-4 shadow-lg">
      <Icon className="w-10 h-10 text-white" />
    </div>
    <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
    <p className="text-slate-300 max-w-xs">{description}</p>
  </motion.div>
); 