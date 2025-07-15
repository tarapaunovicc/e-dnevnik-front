import { Component, Output } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { User } from '../model/User';
import { CurrentUser } from '../model/CurrentUser';
import { TeachersClasses } from '../model/TeachersClasses';
import { TeacherService } from '../service/teacher/teacher.service';
import { Teacher } from '../model/Teacher';
import { Class } from '../model/Class';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // hasClass?: boolean = true;
  teachersClasses: TeachersClasses[] = [];
  classes:Class[]=[];
  user:User=new User();
  teacher?:Teacher | null;
  username:string="";
  constructor(private activatedRoute:ActivatedRoute, private teacherService: TeacherService, private currentUser: CurrentUser,
    private router: Router
  ){}
  ngOnInit(): void {
      this.teacher = this.currentUser.getCurrentTeacher();
      console.log("Current user je: " + JSON.stringify(this.teacher, null, 2));
      this.teachersClasses=this.teacher?.classes ??[];
      console.log("Teachers classes are: " + JSON.stringify(this.teachersClasses, null, 2));
      /*
      console.log(savedTeacher?.username);
      if(this.username)
      this.teacherService.findById(savedTeacher?.username).subscribe(
        (teacher: Teacher) => {     
          this.teacher = teacher;    
          this.currentUser.setCurrentTeacher(teacher);
          this.teachersClasses = this.teacher.classes ?? [];
        }
      )  
        */
  }

  AddLesson(tc:TeachersClasses):void{
    this.router.navigate(['/class', tc.cl.classId], {state: {classId: tc.cl.classId}});
  }
  ViewStudents(tc:TeachersClasses):void{
    this.router.navigate(['/students', tc.cl.classId], {state: {classId: tc.cl.classId}})
  }
}
