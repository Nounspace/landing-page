// Random color generator for the grid animation
export const randomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#AED6F1', '#D7BDE2', '#F9E79F'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};