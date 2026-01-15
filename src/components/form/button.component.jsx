// Utils
import { cn } from "@/utils/tailwind.utils";

// Icons
import { Loader2 } from "lucide-react";

const ButtonComponent = ({
  onClick,
  children,
  size = "lg",
  className = "",
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  ...props
}) => {
  const variants = {
    neutral: "bg-gray-100 hover:bg-gray-200 disabled:!bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:!bg-red-500",
    primary:
      "bg-indigo-500 text-white hover:bg-indigo-600 disabled:!bg-indigo-500",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:!bg-gray-100",
    lightindigo: `bg-indigo-100 text-indigo-500 hover:bg-indigo-200 disabled:!bg-indigo-100`,
  };

  const sizeClasses = {
    none: "",
    sm: "h-9 px-3 rounded-lg text-sm",
    md: "h-10 px-4 rounded-lg",
    lg: "h-11 px-5 rounded-lg",
    xl: "h-12 px-6 rounded-xl",
  };

  return (
    <button
      {...props}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "flex items-center justify-center transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed",
        variants[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin mr-2" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default ButtonComponent;
