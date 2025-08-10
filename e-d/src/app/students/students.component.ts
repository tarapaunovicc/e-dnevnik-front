import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUser } from '../model/CurrentUser';
import { Student } from '../model/Student';
import { StudentService } from '../service/student/student.service';
import { Lesson } from '../model/Lesson';
import { Teacher } from '../model/Teacher';
import { Grade,GradePK } from '../model/Grade';
import { GradeService } from '../service/grade/grade.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})

export class StudentsComponent {
  public classEvidented:boolean=false;
  public classid:number=-1;
  public students:Student[]=[];
  public lesson:Lesson | null =null;
  public teacher: Teacher |null=null;
  public isLoading: boolean = true; 
  public selectedGrade: number | null = null;
  public grade:Grade = new Grade();
  public selectedStudent:Student | null=null;
  public filteredGrades:number[]=[];
  public studentGradesMap: { [username: string]: number[] } = {};
  public searchQuery: string = '';

  constructor(private route: ActivatedRoute, private router: Router, public currentUser: CurrentUser, 
   private studentService:StudentService, private gradeService:GradeService) {}

    ngOnInit(){
      this.teacher=this.currentUser.getCurrentTeacher();
      this.lesson=this.currentUser.getCurrentLesson();
      this.classid=history.state?.classId || null;

      this.studentService.findByStudentClass(this.classid).subscribe(
        (students: Student[]) => {
          this.students = students;

          students.forEach(student => {
          if (this.teacher) {
          this.gradeService.getGradesByStudentAndTeacher(student.username, this.teacher.username)
            .subscribe((grades: Grade[]) => {
              console.log(`Ocene za ${student.firstname} ${student.lastname} (${student.username}):`, grades);
              this.studentGradesMap[student.username] = grades.map(g => g.grade);
            }, error => {
              console.error(`Greška prilikom dohvatanja ocena za ${student.username}:`, error);
            });
        }
      });
    },
    error => {
      console.error('Greška prilikom dohvatanja učenika:', error);

    });          
      this.checkIfTheClassIsEvidented();      
  }
    checkIfTheClassIsEvidented() {
    if (this.lesson && this.lesson.id && this.lesson.id.classid === this.classid) {
      this.classEvidented = true;
    }
    this.isLoading = false;
  }    
    getTeacherGrades(student: Student): number[] {
        if (!student.grades) {
          return [];
        }

        const filteredGrades = student.grades
        ?.filter(grade => grade.teacher?.username === this.teacher?.username)
        .map(grade => grade.grade);

      return filteredGrades;
  }
    
  addNewGrade() {
  if (this.selectedStudent && this.selectedGrade !== null) {
    this.grade.grade = this.selectedGrade;
    this.grade.id=new GradePK();
    this.grade.id.studentusername=this.selectedStudent.username;
    if (this.teacher && this.grade.id) {
        this.grade.id.teacherusername = this.teacher.username;
    }
    this.grade.date = new Date();
    this.gradeService.save(this.grade).subscribe(
      (response: Grade) => {
        console.log('Ocena sačuvana uspešno:', response);

        const studentUsername = this.selectedStudent?.username;

        if (studentUsername && this.teacher) {
          this.gradeService.getGradesByStudentAndTeacher(
            studentUsername,
            this.teacher.username
          ).subscribe({
            next: (grades: Grade[]) => {
              this.studentGradesMap[studentUsername] = grades.map(g => g.grade);
            },
            error: (error) => {
              console.error('Greška prilikom osvežavanja ocena:', error);
            }
          });
        }
        this.selectedGrade = null;
        this.selectedStudent = null;
      },
      error => {
        console.error('Greška prilikom čuvanja ocene:', error);
      }
    );
  } else {
    console.warn('Nije izabrana ocena!');
  }
}


getGrades(student: Student): number[] {
  return this.studentGradesMap[student.username] || [];
}

get filteredStudents(): Student[] {
  const q = this.searchQuery.trim().toLowerCase();
  if (!q) return this.students;
  return this.students.filter(s =>
    `${s.firstname} ${s.lastname}`.toLowerCase().includes(q) ||
    s.firstname.toLowerCase().includes(q) ||
    s.lastname.toLowerCase().includes(q) ||
    (s.username?.toLowerCase().includes(q))
  );
}
}
