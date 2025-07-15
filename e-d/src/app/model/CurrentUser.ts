import { Injectable } from "@angular/core";
import { User } from "./User";
import { Teacher } from "./Teacher";
import { Student } from "./Student";
import { Lesson } from "./Lesson";

@Injectable({
    providedIn: 'root'
  })
  export class CurrentUser {
    private currentTeacher: Teacher | null = null;
    private currentStudent: Student | null = null;
    private currentLesson: Lesson | null=null;
    public presentStudents:Student[]=[];
  
    setCurrentTeacher(user: Teacher): void {
      this.currentTeacher = user;
    }
  
    getCurrentTeacher(): Teacher | null {
      return this.currentTeacher;
    }
    setCurrentStudent(user: Student): void {
      this.currentStudent = user;
    }
  
    getCurrentStudent(): Student | null {
      return this.currentStudent;
    }
    setCurrentLesson(user: Lesson): void {
      this.currentLesson = user;
      this.presentStudents=[];
    }
  
    getCurrentLesson(): Lesson | null {
      return this.currentLesson;
    }
    getPresentStudents(): Student[] | null {
      return this.presentStudents;
    }
    setPresentStudents(presentStudents: Student[]): void {
      this.presentStudents = presentStudents;
    }
    
  }