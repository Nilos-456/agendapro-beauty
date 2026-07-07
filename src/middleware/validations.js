// Middleware para validações comuns

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePhone = (phone) => {
  const regex = /^[\d\s\-\(\)\+]+$/;
  return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

const validateDate = (date) => {
  return !isNaN(Date.parse(date));
};

module.exports = {
  validateEmail,
  validatePhone,
  validateDate
};
