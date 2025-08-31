import classNames from "classnames";
import type { ButtonHTMLAttributes } from "react";

export default function Button({
  variant = "outline",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "icon";
}) {
  return (
    <button
      className={classNames([
        "border-1 p-2 rounded-lg font-bold cursor-pointer",
        "not-disabled:active:translate-y-0.5",
        "disabled:text-gray-500 disabled:cursor-not-allowed",
        variant === "outline" && [
          "text-blue-600",
          "not-disabled:hover:bg-blue-500",
          "not-disabled:hover:text-white ",
        ],
        variant === "solid" && [
          "text-white bg-blue-600 border-transparent",
          "not-disabled:hover:bg-white not-disabled:hover:text-blue-600 not-disabled:hover:border-blue-600",
          "disabled:bg-gray-300",
        ],
        className,
      ])}
      {...props}
    />
  );
}
