import { UserRoles } from './user-roles.model';
export interface UserModel {
    id: string;
    email: string;
    name: string;
    role: UserRoles;
}
export interface NewUserModel {
    email: string;
    name: string;
    password: string;
}
export interface UserActivationModel {
    email: string;
    code: string;
}