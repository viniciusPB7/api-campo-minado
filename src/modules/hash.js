const bcrypt = require('bcryptjs');

const hashPassword = async (senha) => {
  return await bcrypt.hash(senha, 10);
};

const comparePassword = async (senha, hash) => {
  return await bcrypt.compare(senha, hash);
};

module.exports = { hashPassword, comparePassword };
