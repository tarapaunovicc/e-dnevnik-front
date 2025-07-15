import { Absence } from "./Absence"
import { Class } from "./Class"
import { Grade } from "./Grade"
import { User } from "./User"

export class Student{
    username! : string
    firstname!:string
    lastname!:string
    UMCN!:string
    studentClass!:Class
    grades?:Array<Grade>
    absences?:Array<Absence>
    userStudent? : User
}