import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes, ElementType } from "react";

type ButtonBaseProps = {
  children: ReactNode;
  primary?: boolean;
  size?: "default" | "header" | "small";
  loading?: boolean;
  className?: string;
};

type AsButtonProps = ButtonBaseProps & {
  as?: "button";
} & ButtonHTMLAttributes<HTMLButtonElement>;

type AsAnchorProps = ButtonBaseProps & {
  as: "a";
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type AsElementProps = ButtonBaseProps & {
  as: ElementType;
  [key: string]: unknown;
};

export type MatrixButtonProps = AsButtonProps | AsAnchorProps | AsElementProps;

export function MatrixButton({
  as: Comp = "button",
  children,
  primary = false,
  size = "default",
  loading = false,
  className = "",
  ...props
}: MatrixButtonProps) {
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

  const isDisabled = "disabled" in props ? props.disabled : false;

  return (
    <Comp
      className={`${base} ${variant} ${disabledStyle} ${className}`}
      disabled={isDisabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="animate-pulse">●</span>
          {children}
        </span>
      ) : (
        children
      )}
    </Comp>
  );
}
