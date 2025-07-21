exports.validateFields = (fields, body) => {
  for (const field of fields) {
    if (!body[field]) return `${field} is required`;
  }
  return null;
};
