// server/utils/jwtUtils.js
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' }); // Adjust expiry as needed
};

export default generateToken;