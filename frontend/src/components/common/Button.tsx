import React, { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "no_background";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyle =
      "inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantStyles = {
      primary: "text-white font-bold bg-primary-blue focus:ring-blue-500",
      secondary:
        "bg-primary-blue/20 font-bold text-primary-blue focus:ring-primary/50",
      no_background:
        "bg-transparent text-text-gray border-solid border-[0.50px]",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    // sizeStyles 부분을 고정 크기로 변경합니다.
    const sizeStyles = {
      sm: "w-[80px] h-[40px] text-xs", // 80px * 40px
      md: "w-[140px] h-[40px] text-sm", // 140px * 40px
      lg: "w-[297px] h-[40px] text-base", // 297px * 40px
    };

    // fullWidth가 true일 경우, size로 지정된 width를 덮어씁니다.
    const widthStyle = fullWidth ? "w-full" : sizeStyles[size].split(" ")[0];
    const heightAndTextStyle = sizeStyles[size].substring(
      sizeStyles[size].indexOf(" ") + 1
    );

    const combinedClassName = [
      baseStyle,
      variantStyles[variant],
      heightAndTextStyle, // h-[40px] 및 text-..
      widthStyle, // w-[...] 또는 w-full
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
