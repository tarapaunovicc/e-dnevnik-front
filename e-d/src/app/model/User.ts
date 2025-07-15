export class User { 
    username!: string
    password!: string
    role!: Role
}

export enum Role{
    Teacher = 'ROLE_TEACHER',
    Student = 'ROLE_STUDENT'
}