import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

const authService = new AuthService();
const userService = new UserService();

export class AuthController {
  async register(req: Request, res: Response) {
    const {
      username,
      email,
      password,
      role
    } = req.body; // username, email, password
    const _id = await authService.register({ email, password, role });
    await userService.createUser({ _id, username, email });
    res.status(201).end();
  };

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const userToken = await authService.generateUserToken({ email, password });
    // post요청인데 과연 200이 맞을까
    res.status(200).json(userToken);
  };
};
