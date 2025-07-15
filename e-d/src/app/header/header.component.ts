import { Component, Input, signal } from '@angular/core';
import { StudentService } from '../service/student/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUser } from '../model/CurrentUser';
import { Teacher } from '../model/Teacher';
import { ClassService } from '../service/class/class.service';
import { Class } from '../model/Class';
import { NotificationService } from '../service/notification/notification.service';
import { AuthenticationService } from '../security/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  hasClass = signal(true);
  user: Teacher | null = null;
  cl:Class=new Class();
  classTeacher:boolean=true;
  public message: string = '';


  constructor(private router: Router, public currentUser: CurrentUser, 
    private classService:ClassService, private notificationService:NotificationService,
    private authService:AuthenticationService
  ) {}

  ngOnInit(): void {
    this.getMyClass();  
  }

  goToUserPage(): void {
    this.user=this.currentUser.getCurrentTeacher();
    if (this.user) {
      this.router.navigate(['/user'], { replaceUrl: true });
    }
  }
  
  openMyClass(): void {
    this.user = this.currentUser.getCurrentTeacher();
  
    if (this.user) {
      this.classService.findByTeacherUsername(this.user.username).subscribe(
        (data: Class | null) => {
          if (data) {
            // Ako profesor ima dodeljeno odeljenje, navigiraj na stranicu sa odeljenjem
            this.router.navigate(['/myClass'], { state: { classId: data.classId } });
          } else{
            this.notificationService.addNotification("Niste razredni starešina.");
          }
          // Ako nema dodeljeno odeljenje, ništa se ne dešava
        },
        (error) => {
          console.error('Error fetching class:', error);
          // Greška se obrađuje, ali ništa se ne prikazuje korisniku
        }
      );
    }
  }

  getMyClass(){
    if(this.currentUser.getCurrentTeacher()){
      this.user = this.currentUser.getCurrentTeacher();
      if(this.user){
        console.log("tu sam");
        this.classService.findByTeacherUsername(this.user.username).subscribe(
          (data: Class | null) => {
            console.log("tu sam" + JSON.stringify(data, null, 2));
            if (data && data !== null) {
              this.hasClass.set(true);
            // Ako nema dodeljeno odeljenje, ništa se ne dešava
            }else{
              this.hasClass.set(false);
            }
          }
        );
    
      }

    }
      
  }
  logout(){
    this.authService.logout$().subscribe(() => {
      this.router.navigate(['']).then(() => {
        window.location.reload(); 
      });
    });
  }
}




