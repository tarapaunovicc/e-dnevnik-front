import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from '../service/class/class.service';
import { CurrentUser } from '../model/CurrentUser';
import { Student } from '../model/Student';
import { StudentService } from '../service/student/student.service';
import { Lesson } from '../model/Lesson';
import { Teacher } from '../model/Teacher';
import { Absence, AbsencePK } from '../model/Absence';
import { AbsenceService } from '../service/absence/absence.service';
import { Grade } from '../model/Grade';
import { GradeService } from '../service/grade/grade.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})

export class StudentsComponent {
  public absentStudents:Student[] | null=null;;
  public classEvidented:boolean=false;
  public classid:number=-1;
  public students:Student[]=[];
  public absence:Absence=new Absence();
  public absencePK:AbsencePK=new AbsencePK();
  public lesson:Lesson | null =null;
  public teacher: Teacher |null=null;
  public isLoading: boolean = true; 
  public help:boolean=false;
  public selectedGrade: number | null = null;
  public grade:Grade = new Grade();
  public selectedStudent:Student | null=null;
  public presentStudents: Student[] | null=null;

  constructor(private route: ActivatedRoute, private router: Router, public currentUser: CurrentUser, 
   private studentService:StudentService, private absenceService: AbsenceService, private gradeService:GradeService) {}

    ngOnInit(){
      this.teacher=this.currentUser.getCurrentTeacher();
      this.lesson=this.currentUser.getCurrentLesson();
      this.presentStudents=this.currentUser.getPresentStudents();
          this.classid=history.state?.classId || null;
          if(this.classid!= null && this.lesson?.cl.classId==this.classid){
            //this.absentStudents=this.currentUser.getAbsentStudents();
            this.help=true;
          }
          else{
            this.absentStudents=[];
            this.help=true;
          }
        
        this.studentService.findByStudentClass(this.classid).subscribe(
          (students: Student[]) => {
            this.students=students;
          }
        )
          
        this.checkIfTheClassIsEvidented();      
  }
    checkIfTheClassIsEvidented() {
      if(this.lesson && this.lesson.cl.classId==this.classid) this.classEvidented=true;
      console.log(this.classid);
      console.log(this.classEvidented);
      this.isLoading=false;
      console.log(this.isLoading);
    }

    public ViewGrades(st: Student){
      this.router.navigate(['/grades'] ,{state:{student:st}});
    }
    public AddAbsence(st: Student) {
      if (this.absentStudents === null) {
        this.absentStudents = []; 
      }
      const alreadyAbsent = this.absentStudents.find(s => s.username === st.username);
      if (!alreadyAbsent) {
        this.absentStudents.push(st);
        console.log("Student added to absent list:", st);
      } else {
        console.log("Student already in the absent list:", st);
      }
    }

    RemoveAbsence(st: Student) {
      if (this.absentStudents === null) {
        this.absentStudents = []; 
      }

      this.absentStudents = this.absentStudents.filter(student => student.username !== st.username);
    }
    
    ConfirmAbsences(){
      if (this.absentStudents === null) {
        this.absentStudents = []; 
      }
      this.currentUser.presentStudents=this.absentStudents;

      if(this.lesson) {
        this.absencePK.lessonid=this.lesson?.id.lessonid;
        this.absencePK.teacherusername=this.lesson.id.username;
      }
      this.absencePK.classid = this.classid;
      this.absence.excused = false;
      this.absence.isfinal = false;
    
      this.absentStudents.forEach((student, index) => {
        let absenceRecord = { ...this.absence }; 
        absenceRecord.student = student;
        absenceRecord.id = { ...this.absencePK }; 
        absenceRecord.id.studentusername = student.username;
    
        this.absenceService.save(absenceRecord).subscribe(
          response => console.log('Absence saved successfully', response),
          error => console.error('Error saving absence', error)
        );
      });
    }
    getTeacherGrades(student: Student): number[] {
      if (!student.grades) {
        return [];
      }

      const filteredGrades = student.grades
      ?.filter(grade => grade.teacher?.username === this.teacher?.username)
      .map(grade => grade.grade);

    console.log('Filtered Grades:', filteredGrades);
    return filteredGrades;
    }
    addNewGrade(){
      if (this.selectedStudent && this.selectedGrade !== null) {
        this.grade.grade=this.selectedGrade;
        this.teacher=this.currentUser.getCurrentTeacher();
        this.grade.student = this.selectedStudent;
        this.grade.teacher = this.teacher;
        this.grade.date=new Date();
        console.log(this.grade);
        this.gradeService.save(this.grade).subscribe(
          response => {
            console.log('Ocena sačuvana uspešno:', response);     
            const studentIndex = this.students.findIndex(student => student.username === this.selectedStudent?.username);
            if (studentIndex !== -1) {
              const student = this.students[studentIndex];
                  if (!student.grades) student.grades = [];
                  student.grades.push(this.grade);
                  this.selectedGrade = null;
                  this.selectedStudent = null;
            }    
          },
          error => {
            console.error('Greška prilikom čuvanja ocene:', error);
          }
        );
      } else {
        console.warn('Nije izabrana ocena!');
      }
    }
    
}
