import { Role } from '../../../api/user/role.enum';

export interface JwtPayload {
  id: number;
  email: string;
  role: Role;
  isActive2StepVerify: boolean;
}
