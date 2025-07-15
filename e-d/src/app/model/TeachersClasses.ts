import { Class } from "./Class"
import { Teacher } from "./Teacher"

export class TeachersClasses{
    id!:TeachersClassesPK
    teacher!:Teacher
    cl!:Class

}
export class TeachersClassesPK{
    classid!:number
    teacherusername!:string
}