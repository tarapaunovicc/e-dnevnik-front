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
  public searchQuery: string = '';
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

  public get filteredStudents(): Student[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.students;
    return this.students.filter(s =>
      `${s.firstname} ${s.lastname}`.toLowerCase().includes(q) ||
      s.firstname.toLowerCase().includes(q) ||
      s.lastname.toLowerCase().includes(q) ||
      (s.username?.toLowerCase().includes(q))
    );
  }

  public viewDetails(st: Student){
    this.router.navigate(['/details'] , { state: { user: st }});
  }
 
}
