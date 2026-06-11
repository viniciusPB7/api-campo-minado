const jwt = require('jsonwebtoken');

const gerarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const verificarToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { gerarToken, verificarToken };
