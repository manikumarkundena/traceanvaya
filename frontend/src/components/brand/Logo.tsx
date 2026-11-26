import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  textClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = 28,
  showWordmark = true,
  textClassName = "text-lg",
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Ambient background node glow */}
        <circle cx="18" cy="18" r="16" fill="#5EEAD4" fillOpacity="0.08" />
        
        {/* Connecting trace lines */}
        <path
          d="M7 11 L18 7 L29 11 L25 25 L18 29 L11 25 Z"
          stroke="#222C3A"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        
        <path
          d="M7 11 L18 18 L29 11"
          stroke="#5EEAD4"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M18 18 L18 29"
          stroke="#5EEAD4"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M11 25 L18 18 L25 25"
          stroke="#D8B978"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 2"
        />

        {/* Evidence nodes */}
        <circle cx="18" cy="7" r="2.5" fill="#5EEAD4" />
        <circle cx="7" cy="11" r="2" fill="#60A5FA" />
        <circle cx="29" cy="11" r="2" fill="#60A5FA" />
        <circle cx="18" cy="18" r="3" fill="#5EEAD4" />
        <circle cx="11" cy="25" r="2" fill="#D8B978" />
        <circle cx="25" cy="25" r="2" fill="#D8B978" />
        <circle cx="18" cy="29" r="2.5" fill="#34D399" />
      </svg>

      {showWordmark && (
        <span className={`font-semibold tracking-tight text-foreground flex items-center ${textClassName}`}>
          Trace<span className="text-accent">Anvaya</span>
        </span>
      )}
    </div>
  );
};
