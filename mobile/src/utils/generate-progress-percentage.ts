export function generateProgressPercentage(total: number, completed: number) {
  const percentage = Math.round((completed * 100) / total);
  return percentage <= 100 ? percentage : 100;
}
