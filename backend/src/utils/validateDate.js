export const validateBirthdate = (birthdate) => {
  if (!birthdate) return null; // если поле не передано — ок

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(birthdate)) {
    throw new Error('Invalid birthdate format (expected YYYY-MM-DD)');
  }

  const date = new Date(birthdate);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid birthdate value');
  }

  const today = new Date();
  const minDate = new Date('1900-01-01');

  if (date > today) {
    throw new Error('Birthdate cannot be in the future');
  }

  if (date < minDate) {
    throw new Error('Birthdate is too old (before 1900)');
  }

  return birthdate;
};
