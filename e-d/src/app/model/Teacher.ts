import { Subject } from "./Subject"
import { TeachersClasses } from "./TeachersClasses"
import { User } from "./User"

export class Teacher {
    username! : string
    firstname!:string
    lastname!:string
    subject!:Subject
    classes?:Array<TeachersClasses>
    userTeacher? : User
}