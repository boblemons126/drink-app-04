import React from 'react';
import LiquidGlass from 'liquid-glass-react';

interface LiquidGlassCardProps extends React.ComponentProps<typeof LiquidGlass> {
  children: React.ReactNode;
}

const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  displacementScale = 64,
  blurAmount = 0.1,
  saturation = 130,
  aberrationIntensity = 2,
  elasticity = 0.35,
  cornerRadius = 24,
  padding = '1.5rem',
  ...props
}) => {
  return (
    <LiquidGlass
      displacementScale={displacementScale}
      blurAmount={blurAmount}
      saturation={saturation}
      aberrationIntensity={aberrationIntensity}
      elasticity={elasticity}
      cornerRadius={cornerRadius}
      padding={padding}
      {...props}
    >
      {children}
    </LiquidGlass>
  );
};

export default LiquidGlassCard; 