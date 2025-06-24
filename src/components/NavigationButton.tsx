import React from "react";

interface NavigationButtonProps {
  text: string;
  onClick?: () => void;
  variant?: "default" | "glass" | "admin";
  icon?: React.ReactNode;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  text,
  onClick,
  variant = "default",
  icon,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "glass":
        return `
          bg-verse-glass-bg backdrop-blur-verse 
          border border-verse-glass-border 
          text-verse-text-primary
          hover:bg-verse-glass-hover hover:shadow-verse-glow
        `;
      case "admin":
        return `
          bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple
          text-white border-0
          hover:shadow-verse-purple-glow hover:scale-105
        `;
      default:
        return `
          bg-verse-nav-button text-verse-text-secondary
          hover:bg-opacity-90 hover:shadow-verse
        `;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        absolute top-6 left-6 z-20
        px-verse-md py-verse-sm
        rounded-verse
        text-verse-sm font-verse-medium
        shadow-verse
        transition-all duration-verse
        focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50
        flex items-center space-x-2
        group
        ${getVariantClasses()}
      `}
    >
      {icon && (
        <span className="transition-transform duration-verse group-hover:scale-110">
          {icon}
        </span>
      )}
      <span>{text}</span>
    </button>
  );
};
