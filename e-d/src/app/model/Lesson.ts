import { Class } from "./Class"
import { Teacher } from "./Teacher"

export class Lesson{
    id!:LessonPK
    date?:Date
    classOrdinalNumber!:number
    curriculum?:string;
    teacher!:Teacher
    cl!:Class    
    
} 
export class LessonPK{
    lessonid!:number
    classid!:number
    username!:string
}
