import { Component } from '@angular/core';
import { Student } from '../model/Student';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUser } from '../model/CurrentUser';
import { StudentService } from '../service/student/student.service';
import { LessonService } from '../service/lesson/lesson.service';
import { Lesson, LessonPK } from '../model/Lesson';
import { Teacher } from '../model/Teacher';
import { AbsenceService } from '../service/absence/absence.service';
import { Absence, AbsencePK } from '../model/Absence';

@Component({
  selector: 'app-absences',
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.css']
})
export class AbsencesComponent {

  public defaultClass: number=1;
  public default="";
  todayDate: string=""

  user: string="";
  classid:number=-1;

  public student:Student=new Student;
  public teacher:Teacher | null =null ;

  private lessonPK:LessonPK=new LessonPK;
  public lesson:Lesson | null =null ;

  public absence:Absence=new Absence();
  public absencePK:AbsencePK=new AbsencePK();

  constructor(private route: ActivatedRoute, private router: Router, public currentUser: CurrentUser, 
   private studentService:StudentService, private lessonService:LessonService, private absenceService:AbsenceService) {}

    ngOnInit(){
      this.getStudent();
      
      this.getTeacher();
       
      this.getTodaysDate();

      this.getLesson();
    }

    public getLesson() {
      this.lesson=this.currentUser.getCurrentLesson();
    }

    public getTeacher() {
     this.teacher=this.currentUser.getCurrentTeacher();
     if(this.teacher){
        this.user=this.teacher.username;
        this.absencePK.teacherusername=this.user;
      }
    }

    public getStudent() {
      this.route.params.subscribe((params) => {
      this.route.queryParams.subscribe(params => {
        if (params['user']) {
          this.student = JSON.parse(params['user']);
          this.absence.student=this.student;
          this.absencePK.studentusername=this.student.username;
      }})})
    }
    
    public getTodaysDate() {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
  
      this.todayDate = `${year}-${month}-${day}`;  
    }


   findLessonIfEvidented(): void {
      this.lessonPK.classid=this.classid;
      if(this.user) this.lessonPK.username=this.user;
      this.lessonService.findById(this.lessonPK).subscribe(
        (data: Lesson) => {
          this.lesson = data;
          this.absence.lesson=data;
          this.absencePK.classid=data.cl.classId;
   })}

   public submit(){
    this.absence.excused=false;
    this.absence.id=this.absencePK;
    this.absenceService.save(this.absence);

    this.router.navigate(['/students',, this.lesson?.cl.classId], { state: { classId: this.lesson?.cl.classId } });
   }
}


