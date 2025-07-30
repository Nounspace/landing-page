// Random color generator for the grid animation
export const randomColor = (): string => {
  const colors = [
    '#00FFFF', '#FF00FF', '#FFFF00', // Cyan, Magenta, Yellow (less saturated)
    '#80FFFF', '#FF80FF', '#FFFF80', // Light Cyan, Light Magenta, Light Yellow
    '#40FFFF', '#FF40FF', '#FFFF40', // Medium Cyan, Medium Magenta, Medium Yellow
    '#C0FFFF', '#FFC0FF', '#FFFFC0'  // Very Light variations
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};