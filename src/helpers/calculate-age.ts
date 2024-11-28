export const calculateAge = (dateOfBirth: Date) => {
  const dob = new Date(dateOfBirth); // Parse the date of birth
  const today = new Date(); // Get today's date

  let age = today.getFullYear() - dob.getFullYear(); // Calculate the difference in years
  const isBeforeBirthday =
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());

  if (isBeforeBirthday) {
    age--; // Subtract one if the birthday hasn't occurred yet this year
  }

  return age;
};
