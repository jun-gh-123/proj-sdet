function validateName(name) {
  return name.length >= 3;
}

function validateEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

module.exports = { validateName, validateEmail };
