const bcrypt = require('bcrypt')

const validatePassword = async (rawPassword, hashedPassword) => {
  const isValid = await bcrypt.compare(rawPassword, hashedPassword);
  return isValid;
}

const validatePasswordSync = (rawPassword, hashedPassword) => {
  return bcrypt.compareSync(rawPassword, hashedPassword);
}

module.exports = {
  validatePassword,
  validatePasswordSync,
}
