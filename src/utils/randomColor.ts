// Random color generator for chromatic aberration effects
export const randomColor = (): string => {
  const colors = [
    // Primary RGB colors for strong chromatic aberration
    '#FF0000', '#00FF00', '#0000FF', // Pure Red, Green, Blue
    
    // Secondary colors that work well with RGB separation
    '#FF0080', '#8000FF', '#0080FF', // Magenta, Purple, Blue
    '#FF8000', '#80FF00', '#0080FF', // Orange, Lime, Blue
    
    // Bright neon colors that create strong aberration
    '#FF00FF', '#00FFFF', '#FFFF00', // Magenta, Cyan, Yellow
    '#FF40FF', '#40FFFF', '#FFFF40', // Bright variations
    
    // Colors that create interesting RGB channel separation
    '#FF2000', '#20FF00', '#0020FF', // Red-tinted, Green-tinted, Blue-tinted
    '#FF0040', '#40FF00', '#0040FF', // Deep variations
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};