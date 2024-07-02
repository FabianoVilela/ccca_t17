export function validateCarPlate(carPlate: string | undefined) {
  if (!carPlate) return false;

  const regex = /[A-Z]{3}[0-9]{4}/;

  return regex.test(carPlate);
}
