export const validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword,
) => {
  const errors = {};

  if (!username || username.trim() === "") {
    errors.username = "Username must not be empty";
  }

  if (!email || email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }

  if (!password || password === "") {
    errors.password = "Password must not be empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
