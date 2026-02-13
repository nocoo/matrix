// Pure utility functions extracted from MatrixExtras to avoid
// react-refresh warnings (files mixing components and non-components).

interface MotionPreferenceContext {
  prefersReducedMotion?: boolean;
  screenshotCapture?: boolean;
  screenshotMode?: boolean;
}

interface ScrambleContext {
  scrambleRespectReducedMotion?: boolean;
  prefersReducedMotion?: boolean;
  screenshotMode?: boolean;
}

export function shouldFetchGithubStars({
  prefersReducedMotion,
  screenshotCapture,
}: MotionPreferenceContext): boolean {
  if (screenshotCapture) return false;
  if (prefersReducedMotion) return false;
  return true;
}

export function shouldRunLiveSniffer({
  prefersReducedMotion,
  screenshotMode,
}: MotionPreferenceContext): boolean {
  if (screenshotMode) return false;
  if (prefersReducedMotion) return false;
  return true;
}

export function shouldScrambleText({
  scrambleRespectReducedMotion,
  prefersReducedMotion,
  screenshotMode,
}: ScrambleContext): boolean {
  if (screenshotMode) return false;
  if (scrambleRespectReducedMotion && prefersReducedMotion) return false;
  return true;
}
