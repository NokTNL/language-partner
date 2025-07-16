import classNames from "classnames";
import type { ButtonHTMLAttributes } from "react";

export default function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={classNames([
        "border-1 px-4 py-2 rounded-lg font-bold text-black",
        "disabled:text-gray-500",
        "not-disabled:hover:bg-gray-700 not-disabled:hover:text-white not-disabled:active:translate-y-0.5",
        className,
      ])}
      {...props}
    />
  );
}
