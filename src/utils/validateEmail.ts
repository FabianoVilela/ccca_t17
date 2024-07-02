export function validateEmail(email: string) {
  if (!email) return false;

  const regex = /^(.+)@(.+)$/;

  return regex.test(email);
}
