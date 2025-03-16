// language: typescript
import { generateToken, verifyToken, TokenPayload } from './app/services/jwtService';
import { connectRedis, setToken, getToken, deleteToken } from './app/services/cacheService';
import { authService } from './app/services/authService';
import bcrypt from 'bcrypt';

(async function main() {
  // Connect to Redis
  await connectRedis();
  
  // Generate a JWT token and verify it to get the payload
  const payload: TokenPayload = { userId: 'test-user', role: 'admin' };
  const token = generateToken(payload);
  console.log('Generated Token:', token);
  
  // Directly parse the token using our jwtService
  const decoded = verifyToken(token);
  if (!decoded) {
    console.error('Token is null');
    return;
  }
  console.log('Decoded Token:', decoded);
  
  // Store the decoded token payload in Redis for caching purposes
  const cacheKey = `token:${token}`;
  await setToken(cacheKey, JSON.stringify(decoded), 60); // cache expires in 60 seconds
  
  // Retrieve the cached token payload from Redis
  const cached = await getToken(cacheKey);
  if (cached) {
    console.log('Cached Token Payload:', JSON.parse(cached));
  } else {
    console.error('No cached token payload found');
  }
  
  // Clean up - delete the cached token for repeated runs
  await deleteToken(cacheKey);
  
  // Optional: Use the authService.verifyToken which caches the result internally
  const verified = await authService.verifyToken(token);
  console.log('Verified Token via authService:', verified);
  
  // Demonstrate bcrypt (just for illustration)
  const hashedPassword = bcrypt.hashSync('password', 10);
  console.log('Hashed Password:', hashedPassword);
})();