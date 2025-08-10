import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../service/student/student.service';
import { LessonService } from '../service/lesson/lesson.service';
import { CurrentUser } from '../model/CurrentUser';
import { AbsenceService } from '../service/absence/absence.service';
import { Student } from '../model/Student';
import { GradeService } from '../service/grade/grade.service';
import { Grade } from '../model/Grade';
import { Teacher } from '../model/Teacher';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent {

  public selectedGrade: number | null = null;
  public grade:Grade = new Grade();
  public student: Student | null=null;
  //public student?: Student;  
  public grades: Grade[]=[];
  uniqueSubjects: { [key: string]: number[] } = {};
  public teacher:Teacher | null=null;
  constructor(private route: ActivatedRoute, private router: Router, public currentUser: CurrentUser, 
    private studentService:StudentService, private gradeService:GradeService) {}
 
  ngOnInit(){
    this.getStudent();
    this.teacher=this.currentUser.getCurrentTeacher();
  }
  /*
  getGrades() {
    if(this.student) this.gradeService.findByStudentUsername(this.student?.username).subscribe(
      (data: Grade[]) => {
        this.grades = data;
        this.processGrades();
      },
      (error: any) => {
        console.error('Error fetching student subjects', error);
      });
  }
  */

  public getStudent() {
    this.student=history.state?.student;
        //this.getGrades(this.student);
  }


  //ovo je kod za ceo dnevnik
  // processGrades(): void {
  //   this.grades.forEach(grade => {
  //     if (!this.uniqueSubjects[grade.teacher.subject.name]) {
  //       this.uniqueSubjects[grade.teacher.subject.name] = [];
  //     }
  //     if (grade.grade !== -1) {
  //       this.uniqueSubjects[grade.teacher.subject.name].push(grade.grade);
  //     }
  //   });
  // }

  processGrades(): void {
    
    this.grades
      .filter(grade => {
        if(grade.teacher)
          grade.teacher.username === this.teacher?.username
      })
        
      .forEach(grade => {
        if (grade.teacher && !this.uniqueSubjects[grade.teacher.subject.name]) {
          this.uniqueSubjects[grade.teacher.subject.name] = [];
        }
        if (grade.teacher && grade.grade !== -1) {
          this.uniqueSubjects[grade.teacher.subject.name].push(grade.grade);
        }
      });
  }

  getSubjectNames(): string[] {
    return Object.keys(this.uniqueSubjects);
  }

  goToStudentsPage(){

  }

  addNewGrade(){
    
    if (this.selectedGrade !== null) {
      this.grade.grade=this.selectedGrade;
      //this.student=this.currentUser.getCurrentStudent();
      this.teacher=this.currentUser.getCurrentTeacher();
      //napravi ocenu jebenu
      this.grade.student = this.student;
      this.grade.teacher = this.teacher;
        
      console.log("Ocena koja se salje je: " + JSON.stringify(this.grade, null, 2));
      this.gradeService.save(this.grade).subscribe(
        response => {
          console.log('Ocena sačuvana uspešno:', response);
          // Opcionalno, možeš dodati logiku za ažuriranje UI ili obaveštavanje korisnika
        },
        error => {
          console.error('Greška prilikom čuvanja ocene:', error);
          // Opcionalno, obrada greške
        }
      );
    } else {
      console.warn('Nije izabrana ocena!');
    }
  }
  getGrades(student: Student): void {
  if (!this.teacher || !student.username) {
    return;
  }
/*
  this.gradeService.getGradesByStudentAndTeacher(student.username, this.teacher.username)
    .subscribe((grades: Grade[]) => {
      this.filteredGrades = grades.map(g => g.grade);
    });
    */
}
}
