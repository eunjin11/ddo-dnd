export const colorFromPosition = (pos: { x: number; y: number }) => {
  const hue = Math.abs(pos.x * 37 + pos.y * 57) % 360;
  return `hsl(${hue} 65% 60%)`;
};

export const colorFromPositionAlpha = (
  pos: { x: number; y: number },
  alpha = 0.2
) => {
  const hue = Math.abs(pos.x * 37 + pos.y * 57) % 360;
  return `hsl(${hue} 65% 60% / ${alpha})`;
};
