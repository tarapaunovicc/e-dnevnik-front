import { Student } from "./Student"
import { Teacher } from "./Teacher"

export class Grade{
    id!:GradePK
    date?:Date
    grade!:number;
    student!:Student | null;
    teacher!:Teacher | null;
    
}
export class GradePK{
    gradeid!:number
    studentusername!:string
    teacherusername!:string
}