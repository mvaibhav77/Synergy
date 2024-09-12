import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "accent";
  className?: string;
  label?: string;
}

export default function Loader({
  size = "medium",
  color = "primary",
  className,
  label = "Loading...",
}: LoaderProps = {}) {
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4",
  };

  const colorClasses = {
    primary: "border-primary border-t-primary-foreground",
    secondary: "border-secondary border-t-secondary-foreground",
    accent: "border-accent border-t-accent-foreground",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-solid",
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        role="status"
        aria-label={label}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
