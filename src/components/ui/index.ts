// ============================================
// UI Foundation Components
// ============================================

export { AsciiBox, ASCII_CHARS } from "./AsciiBox";
export { MatrixButton } from "./MatrixButton";
export type { MatrixButtonProps } from "./MatrixButton";
export { MatrixShell } from "./MatrixShell";

// Additional components from MatrixExtras
export {
  MatrixAvatar,
  ScrambleText,
  DecodingText,
  SignalBox,
  MatrixInput,
  TypewriterText,
  ConnectionStatus,
  DataRow,
  LeaderboardRow,
  LiveSniffer,
  Sparkline,
  MatrixRain,
  BootScreen,
  shouldFetchGithubStars,
  shouldRunLiveSniffer,
  shouldScrambleText,
} from "./MatrixExtras";

// Data visualization components
export {
  TrendMonitor,
  TrendChart,
  ActivityHeatmap,
  ArchiveHeatmap,
} from "./DataVizComponents";
