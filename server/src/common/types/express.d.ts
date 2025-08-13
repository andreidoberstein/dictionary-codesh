import 'express';
declare module 'express' 

interface AuthRequest extends Request {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
