export const startTime = () => new Date().getTime();

export const endTime = () => new Date().getTime();

// Calculate time in millisecons
export const period = (startTime: number, endTime: number) => {
  const startDate = new Date(startTime) as any;
  const endDate = new Date(endTime) as any;

  return Math.abs(endDate - startDate);
};