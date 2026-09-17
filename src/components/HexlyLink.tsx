import { useTranslation } from "react-i18next";

export function HexlyLink() {
	const { i18n } = useTranslation();
	const chinese = i18n.language.startsWith("zh");
	const label = chinese ? "在 hexly.ai 查看 Matrix" : "Matrix on hexly.ai";

	const accessibleLabel = `${label}${chinese ? "（在新标签页打开）" : " (opens in a new tab)"}`;

	return (
		<a
			href="https://hexly.ai/projects/matrix"
			target="_blank"
			rel="noopener noreferrer"
			title={label}
			aria-label={accessibleLabel}
			className="flex h-7 w-7 shrink-0 items-center justify-center text-matrix-dim transition-colors hover:text-matrix-primary"
		>
			<span className="sr-only">{accessibleLabel}</span>
			<svg
				className="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="m12 2 8.66 5v10L12 22l-8.66-5V7Z" />
				<path d="M12 2v20M3.34 7l17.32 10m0-10L3.34 17" />
			</svg>
			<span className="sr-only">{`${label}${chinese ? "（在新标签页打开）" : " (opens in a new tab)"}`}</span>
		</a>
	);
}
