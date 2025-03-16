import { generateToken, verifyToken } from './app/services/jwtService';
import bcrypt from 'bcrypt';
import { LoginService } from './app/services/loginService';


   let token = generateToken({ userId: '12345', role: 'admin'});
  console.log(token);
  
  const decoded = verifyToken(token);
  console.log(decoded);


  const hashedPassword = bcrypt.hashSync('password', 10);
  console.log(hashedPassword);

  (async function main() {
    let token2 = await LoginService.login('example@gmail.com', 'password', "admin");
    console.log(token2);
    if (token2) {
      console.log(verifyToken(token2));
    } else {
      console.error('Token is null');
    }
  })();