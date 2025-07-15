import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUser } from '../model/CurrentUser';
import { Teacher } from '../model/Teacher';
import { TeacherService } from '../service/teacher/teacher.service';
import { ClassService } from '../service/class/class.service';
import { Class } from '../model/Class';
import { Lesson, LessonPK } from '../model/Lesson';
import { LessonService } from '../service/lesson/lesson.service';
import { Student } from '../model/Student';
import { StudentService } from '../service/student/student.service';
import { Absence, AbsencePK } from '../model/Absence';
import { AbsenceService } from '../service/absence/absence.service';
import { NotificationService } from '../service/notification/notification.service';

@Component({
  selector: 'app-class-record',
  templateUrl: './class-record.component.html',
  styleUrls: ['./class-record.component.css']
})
export class ClassRecordComponent {
  public students: Student[] = [];
  public absentStudents: Student[] = [];
  public selectedStudent: Student | null = null;
  public absence:Absence=new Absence();
  public absencePK:AbsencePK=new AbsencePK();
  public teacher: Teacher | null = null;
  public lesson: Lesson = new Lesson();
  public lessonPK: LessonPK = new LessonPK();
  public classOrdinalNumber = 0;
  public todayDate: string = "";
  public teacherName: string = "";
  public today: Date = new Date();
  public curriculum: string = "";

  public clas: Class = new Class();
  public subjectName: string = "";
  public classid: number = -1;

  constructor(private route: ActivatedRoute, private router: Router, public currentUser: CurrentUser, 
    private teacherService: TeacherService, private classService: ClassService,
    private lessonService: LessonService, private studentService: StudentService,
  private absenceService:AbsenceService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.getTeacher();
    this.getClass();
    this.getTodaysDate();
    this.getStudents();    
  }

  getTeacher() {
    this.teacher = this.currentUser.getCurrentTeacher();
    if (this.teacher) {
      this.subjectName = this.teacher.subject.name;
      this.teacherName = this.teacher.firstname + " " + this.teacher.lastname;
      this.lessonPK.username = this.teacher.username;
      this.lesson.teacher = this.teacher;
    }
  }

  getStudents() {
    this.route.params.subscribe((params) => {
      if (params['students']) {
        this.classid = params['students'];
      }

      this.studentService.findByStudentClass(this.classid).subscribe(
        (students: Student[]) => {
          this.students = students;
        }
      );
    });
  }

  getClass() {
      this.classid=history.state?.classId || null;
      if(this.classid)
      this.classService.findById(this.classid).subscribe(
        (clas: Class) => {
          this.clas = clas;
          this.lessonPK.classid = this.clas.classId;
        }
      );
  }

  public submit() {
    this.saveLesson();
  }

  public saveLesson(){
    this.lessonPK.lessonid = 1;
    this.lesson.id = this.lessonPK;
    this.lesson.classOrdinalNumber = this.classOrdinalNumber;
    this.lesson.date = this.today;
    this.lesson.cl = this.clas;
    this.lesson.curriculum = this.curriculum;
    
    this.lessonService.save(this.lesson).subscribe(
      response => {
        this.currentUser.setCurrentLesson(response);
        this.lesson=response;
        this.router.navigate(['/students', this.lesson.cl.classId],{state:{classId:this.lesson.cl.classId}});
        this.saveAbsences();
      },
      error => {
        console.error('Error saving lesson:', error);
      }
    );
  }

  public AddAbsence() {
    if (!this.selectedStudent) return;

    // Proveri da li je već odsutan
    const alreadyAbsent = this.absentStudents.find(s => s.username === this.selectedStudent!.username);
    if (!alreadyAbsent) {
      this.absentStudents.push(this.selectedStudent);
      this.removeStudentFromList(this.selectedStudent);
      console.log("Student added to absent list:", this.selectedStudent);
    } else {
      console.log("Student already in the absent list:", this.selectedStudent);
    }
    this.selectedStudent = null;
  }

  private removeStudentFromList(student: Student) {
    this.students = this.students.filter(s => s.username !== student.username);
  }

  public removeAbsence(student: Student) {
    this.students.push(student);
    this.absentStudents = this.absentStudents.filter(s => s.username !== student.username);
  }

  public getTodaysDate() {
    const day = String(this.today.getDate()).padStart(2, '0');
    const month = String(this.today.getMonth() + 1).padStart(2, '0');
    const year = this.today.getFullYear();
    this.todayDate = `${year}-${month}-${day}`;
  }

  saveAbsences(){
    if (this.absentStudents === null) {
      this.absentStudents = []; 
    }
    //this.currentUser.absentStudents=this.absentStudents;

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
      absenceRecord.lesson=this.lesson;
  
      this.absenceService.save(absenceRecord).subscribe(
        response => console.log('Absence saved successfully', response),
        error => console.error('Error saving absence', error)
      );

      this.currentUser.presentStudents=this.students;
    });
  }
}
