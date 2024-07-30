export function validateName(name: string): boolean {
  if (!name) return false;

  const regex = /^[a-zA-Z]+ [a-zA-Z]+$/;

  return regex.test(name);
}
