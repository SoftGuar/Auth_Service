import { generateToken, verifyToken } from './app/services/jwtService';

  const token = generateToken({ userId: '12345', role: 'admin', extraInfo: 'sample' });
  console.log(token);
  
  const decoded = verifyToken(token);
  console.log(decoded);