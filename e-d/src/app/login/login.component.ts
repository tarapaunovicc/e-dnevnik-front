import { Component } from '@angular/core';
import { User } from '../model/User';
import { Router } from '@angular/router';
import { TeacherService } from '../service/teacher/teacher.service';
import { Teacher } from '../model/Teacher';
import { CurrentUser } from '../model/CurrentUser';
import { AuthenticationService } from '../security/authentication.service';
import { Student } from '../model/Student';
import { StudentService } from '../service/student/student.service';
import { NotificationService } from '../service/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user:User=new User();
  public showPassword = false;
  teacher?: Teacher;
  public isCyrillic = false;
  
  constructor(
    private router: Router, 
    private currentUser: CurrentUser, 
    private teacherService: TeacherService, private authService: AuthenticationService,
  private studentService: StudentService, private notificationService: NotificationService){}

    ngOnInit(): void {
      if (this.authService.currentUser && this.authService.currentUser.value) {
        this.router.navigate(['/user'], { replaceUrl: true });
      }
    }

    toggleScript(): void {
      this.isCyrillic = !this.isCyrillic;
    }

   async submit() {
    this.authService.login$(this.user.username, this.user.password).subscribe(()=>{
      if(this.authService.currentUser !== null || this.authService.currentUser !== undefined){
        this.notificationService.addNotification("Successful login!");
        if(this.authService.currentUser.value?.role === "ROLE_TEACHER"){
          this.teacherService.findById(this.user.username).subscribe((response) => {
            this.currentUser.setCurrentTeacher(response);
            
            this.router.navigate(['/user'], { replaceUrl: true });
          })
        }else{
          this.studentService.findById(this.user.username).subscribe((response) => {
            this.currentUser.setCurrentStudent(response);
            this.router.navigate(['/user'], { replaceUrl: true });
          })
        }
      }else{
        this.notificationService.addNotification("Wrong username or password!");
      }     
    });
  }
}
