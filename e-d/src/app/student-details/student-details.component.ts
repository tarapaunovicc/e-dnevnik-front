import { Component } from '@angular/core';
import { Student } from '../model/Student';
import { Grade } from '../model/Grade';
import { Teacher } from '../model/Teacher';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../service/student/student.service';
import { GradeService } from '../service/grade/grade.service';
import { CurrentUser } from '../model/CurrentUser';
import { AbsenceService } from '../service/absence/absence.service';
import { Absence } from '../model/Absence';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent {
  public absences: Absence[]=[];
  public student: Student | null=null; 
  public grades: Grade[]=[];
  uniqueSubjects: { [key: string]: number[] } = {};
  public teacher:Teacher | null=null;
  currentPage: number = 1;
itemsPerPage: number = 10;
Math = Math;

  constructor(private route: ActivatedRoute, private router: Router, public currentUser: CurrentUser, 
    private studentService:StudentService, private gradeService:GradeService, private absenceService: AbsenceService) {}
 
  ngOnInit(){
    this.getStudent();

    this.teacher=this.currentUser.getCurrentTeacher();

    this.getGrades();

    this.getAbsences();

  }
  get paginatedAbsences(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.absences.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  nextPage() {
    if ((this.currentPage * this.itemsPerPage) < this.absences.length) {
      this.currentPage++;
    }
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getAbsences() {
    if(this.student) this.absenceService.findByStudentUsername(this.student?.username).subscribe(
      (data: Absence[]) => {
        this.absences = data;
      },
      (error: any) => {
        console.error('Error fetching student subjects', error);
      });
  }

  getGrades() {
    if(this.student) this.gradeService.findByStudentUsername(this.student?.username).subscribe(
      (data: Grade[]) => {
        this.grades = data;
        this.processGrades();
      },
      (error: any) => {
        console.error('Error fetching student subjects', error);
      });
  }

  public getStudent() {
   this.student=history.state?.user || null;
  }

  processGrades(): void {
    this.grades.forEach(grade => {
      
      if (grade.teacher && !this.uniqueSubjects[grade.teacher.subject.name]) {
        this.uniqueSubjects[grade.teacher.subject.name] = [];
      }
      if (grade.teacher && grade.grade !== -1) {
        this.uniqueSubjects[grade.teacher.subject.name].push(grade.grade);
      }
    });
  }

  getSubjectNames(): string[] {
    return Object.keys(this.uniqueSubjects);
  }

  onCheckboxChange(absence: Absence, type: string): void {
    if (type === 'justified') {
      absence.excused = !absence.excused;
    } else if (type === 'unjustified') {
      absence.excused = !absence.excused;
    }
  }

  //saveAbsences(): void {
    // Implementirajte logiku za čuvanje izostanaka
    //ako se izostanak desio pre vise od 15 dana, isFinal=true
    //ukoliko je isfinal=true, ne cuva se
    //koliko je isfinal=false, a exused=true, cuva se isfinal=true i exused=true
    
  //}
  saveAbsences(): void {
    const today = new Date();
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(today.getDate() - 15);
  
    let updatedAbsences = this.absences
      .filter(absence => !absence.isfinal) // Filtriraj samo one kojima je isFinal = false
      .map(absence => {
        const absenceDate = absence.lesson.date ? new Date(absence.lesson.date) : today;
  
        // Ako je datum stariji od 15 dana, postavi isFinal na true
        if (absenceDate < fifteenDaysAgo) {
          absence.isfinal = true;
        }
  
        // Ako je bilo koji excused promenjen u true, postavi isFinal na true
        if (absence.excused) {
          absence.isfinal = true;
        }
  
        return absence;
      });
  
    if (updatedAbsences.length === 0) {
      console.log("No absences to update.");
      return;
    }
  
    // Napravi niz HTTP poziva
    const updateRequests = updatedAbsences.map(absence => {
      console.log("Updating absence:", JSON.stringify(absence, null, 2)); // Lepo formatiran JSON ispis
      return this.absenceService.updateAbsences(absence);
    });
    
  
    forkJoin(updateRequests).subscribe({
     next: () => console.log("All absences updated successfully."),
      error: (err) => console.error("Error updating absences:", err)
    });
  }
  
  }
  
  



