import { Lesson, LessonPK } from "./Lesson"
import { Student } from "./Student"

export class Absence{
    id!:AbsencePK
    excused?:boolean
    isfinal!:boolean;
    student!:Student
    lesson!:Lesson
}

export class AbsencePK{
    // absenceid!:number
    teacherusername!:string
    classid!:number
    studentusername!:string
    lessonid!:number
}