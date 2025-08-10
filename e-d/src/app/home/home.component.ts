import { Component, Output } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { User } from '../model/User';
import { CurrentUser } from '../model/CurrentUser';
import { TeachersClasses } from '../model/TeachersClasses';
import { TeacherService } from '../service/teacher/teacher.service';
import { Teacher } from '../model/Teacher';
import { Class } from '../model/Class';
import { TeachersclassesService } from '../service/teachersclasses/teachersclasses.service';


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
    private router: Router, private teachersclassesService: TeachersclassesService
  ){}
  ngOnInit(): void {
      this.teacher = this.currentUser.getCurrentTeacher();
      //this.teachersClasses=this.teacher?.classes ??[];
      if (this.teacher && this.teacher.username) {
        this.LoadTeachersClasses(this.teacher.username);
      }
  }

  AddLesson(tc:TeachersClasses):void{
    this.router.navigate(['/class', tc.cl.classId], {state: {classId: tc.cl.classId}});
  }
  ViewStudents(tc:TeachersClasses):void{
    this.router.navigate(['/students', tc.cl.classId], {state: {classId: tc.cl.classId}})
  }
  LoadTeachersClasses(username: string): void {
    this.teachersclassesService.findByTeacherUsername(username).subscribe({
            next: (response) => {
        this.teachersClasses = response;
    },
    error: (error) => {
        console.error('Greška pri učitavanju teachersClasses:', error);
        this.teachersClasses = [];
    }
});
}
}
