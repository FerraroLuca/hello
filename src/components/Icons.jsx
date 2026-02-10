import React from 'react';
import { Sword, Rocket, Skull, WandSparkles } from 'lucide-react';

export const ThemeIcon = ({ icon, className }) => {
  const props = { className: className || "w-6 h-6" };
  switch (icon) {
    case "sword": return <Sword {...props} />;
    case "rocket": return <Rocket {...props} />;
    case "skull": return <Skull {...props} />;
    case "wand": return <WandSparkles {...props} />;
    default: return <Sword {...props} />;
  }
};