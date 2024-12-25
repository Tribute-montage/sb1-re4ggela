export function generateOrderNumber(funeralHome: string): string {
  const date = new Date();
  const timestamp = date.getTime();
  const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
  const prefix = funeralHome.substring(0, 5).toUpperCase();
  
  return `${prefix}_${formattedDate}_${timestamp.toString().slice(-6)}`;
}