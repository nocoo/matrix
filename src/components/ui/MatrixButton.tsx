import { forwardRef, type ReactNode, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ElementType, type Ref } from "react";

export type MatrixButtonProps = {
  children: ReactNode;
  primary?: boolean;
  size?: "default" | "header" | "small";
  loading?: boolean;
  className?: string;
  as?: ElementType;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children">;

export const MatrixButton = forwardRef<HTMLButtonElement, MatrixButtonProps>(function MatrixButton(
  {
    as: Comp = "button",
    children,
    primary = false,
    size = "default",
    loading = false,
    className = "",
    ...rest
  },
  ref,
) {
  const base =
    size === "header"
      ? "matrix-header-chip matrix-header-action text-caption uppercase font-bold tracking-[0.2em] select-none"
      : size === "small"
        ? "inline-flex items-center justify-center px-2 py-1 border text-caption uppercase font-bold transition-colors select-none"
        : "inline-flex items-center justify-center px-3 py-2 border text-caption uppercase font-bold transition-colors select-none";

  const variant =
    size === "header"
      ? "text-matrix-primary"
      : primary
        ? "bg-matrix-primary text-black border-matrix-primary hover:bg-white hover:border-white"
        : "bg-matrix-panel text-matrix-primary border-matrix-ghost hover:bg-matrix-panel-strong hover:border-matrix-dim";

  const disabledStyle =
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-matrix-panel";

  const isDisabled = rest.disabled;
  const Tag = Comp as ElementType;

  return (
    <Tag
      ref={ref as Ref<never>}
      className={`${base} ${variant} ${disabledStyle} ${className}`}
      disabled={isDisabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="animate-pulse">●</span>
          {children}
        </span>
      ) : (
        children
      )}
    </Tag>
  );
});
