import { Role } from "./User"

export type AuthResponse = {
    id: number,
    accessToken: string,
    refreshToken: string,
    message: string,
    role: Role
}