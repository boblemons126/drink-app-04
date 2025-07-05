import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface ParallaxIconProps {
  children: React.ReactNode;
}

export const ParallaxIcon: React.FC<ParallaxIconProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xTransform = useTransform(x, [-150, 150], [-20, 20]);
  const yTransform = useTransform(y, [-150, 150], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative"
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{ x: xTransform, y: yTransform, rotateX: yTransform, rotateY: xTransform }}
        className="transition-transform duration-200 ease-out"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}; 