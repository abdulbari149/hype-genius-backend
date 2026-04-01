import { Request } from 'express';
import { JwtAccessPayload } from '../app/auth/auth.interface';

export interface CustomRequest extends Request {
  payload?: JwtAccessPayload;
}
