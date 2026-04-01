import { Request } from 'express';
import { JwtAccessPayload } from 'src/app/auth/auth.interface';

export interface CustomRequest extends Request {
  payload?: JwtAccessPayload;
}
