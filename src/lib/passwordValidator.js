export const passwordCriteria = [
  {
    label: "At least 6 characters",
    test: (password) => password.length >= 6,
  },
  {
    label: "At least one uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "At least one lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "At least one special character (!@#...)",
    test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];
