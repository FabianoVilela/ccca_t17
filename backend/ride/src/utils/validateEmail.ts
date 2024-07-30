export function validateEmail(email: string) {
  if (!email) return false;

  const regex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;

  return regex.test(email);
}
