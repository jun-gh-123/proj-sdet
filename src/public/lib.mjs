export function validateName(name) {
  const nameMinLength = 3;

  if (name && name.length >= nameMinLength) {
    return {
      valid: true,
    };
  }

  return {
    valid: false,
    reason: `Name length is less than ${nameMinLength}.`,
  };
}

export function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (re.test(email)) {
    return {
      valid: true,
    };
  }

  return {
    valid: false,
    reason: "Email is not valid.",
  };
}
