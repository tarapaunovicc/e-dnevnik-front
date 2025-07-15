import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUser } from '../model/CurrentUser';
import { StudentService } from '../service/student/student.service';
import { Student } from '../model/Student';

@Component({
  selector: 'app-my-class',
  templateUrl: './my-class.component.html',
  styleUrls: ['./my-class.component.css']
})
export class MyClassComponent {

  public students:Student[]=[];
  public classId:number=0;
  constructor(private route: ActivatedRoute, private router: Router, public currentUser: CurrentUser, 
    private studentService:StudentService) {}
    
  ngOnInit(){
    this.getClassId();
  }
  
  
  public getClassId() {
    this.classId=history.state?.classId || null;
    if(this.classId!=null) this.getStudents();
  }

  public getStudents(){
    this.studentService.findByStudentClass(this.classId).subscribe(
      (students: Student[]) => {
        console.log(students);
        this.students=students;
      }
    )
  }

  public viewDetails(st: Student){
    this.router.navigate(['/details'] , { state: { user: st }});
  }
 
}
