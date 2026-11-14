// Gap arithmetic. Both percentages are rounded to whole points first, so the gap a judge
// sees always equals the two numbers on the card subtracted.

export function roundPercent(value: number): number {
  return Math.round(Math.min(100, Math.max(0, value)));
}

export function gapPoints(segmentPercent: number, marketPercent: number): number {
  return roundPercent(segmentPercent) - roundPercent(marketPercent);
}

export function averageAbsoluteGap(gaps: number[]): number | null {
  if (gaps.length === 0) return null;
  const total = gaps.reduce((sum, gap) => sum + Math.abs(gap), 0);
  return Math.round(total / gaps.length);
}

export function formatGap(gap: number): string {
  if (gap > 0) return `+${gap}`;
  if (gap < 0) return `−${Math.abs(gap)}`;
  return "0";
}

export function describeGap(gap: number, segmentLabel: string): string {
  if (gap > 0) return `${segmentLabel} lean Yes more than the market`;
  if (gap < 0) return `${segmentLabel} lean No more than the market`;
  return `${segmentLabel} agree with the market`;
}
