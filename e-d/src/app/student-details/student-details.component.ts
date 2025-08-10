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
  paginatedAbsences: Absence[] = [];
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
  // get paginatedAbsences(): any[] {
  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   return this.absences.slice(startIndex, startIndex + this.itemsPerPage);
  // }
  
  // nextPage() {
  //   if ((this.currentPage * this.itemsPerPage) < this.absences.length) {
  //     this.currentPage++;
  //   }
  // }
  
  // prevPage() {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //   }
  // }
  prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePaginatedAbsences();
  }
}
nextPage(): void {
  if (this.currentPage * this.itemsPerPage < this.absences.length) {
    this.currentPage++;
    this.updatePaginatedAbsences();
  }
}

  getAbsences() {
    if(this.student) this.absenceService.findByStudentUsername(this.student?.username).subscribe(
      (data: Absence[]) => {
        this.absences = data;
        this.markOldAbsencesAsFinal();
        this.sortAbsencesByDateDesc();
        this.initPagination();

      },
      (error: any) => {
        console.error('Error fetching student subjects', error);
      });
  }

  getGrades() {
  if (this.student && this.teacher) {
    this.gradeService.findByStudentUsername(this.student.username)
      .subscribe(
        (data: Grade[]) => {
          this.grades = data;
          console.log(this.grades);
          this.processGrades();
        },
        (error: any) => {
          console.error('Error fetching grades', error);
        }
      );
  }
}

processGrades(): void {
  this.uniqueSubjects = {};

  this.grades.forEach(grade => {
    const subjectName = grade.teacher?.subject?.name;

    if (!subjectName) {
      return;
    }

    if (!this.uniqueSubjects[subjectName]) {
      this.uniqueSubjects[subjectName] = [];
    }

    if (grade.grade !== -1 && grade.grade != null) {
      this.uniqueSubjects[subjectName].push(grade.grade);
    }
  });

  Object.keys(this.uniqueSubjects).forEach(subject => {
    this.uniqueSubjects[subject].sort((a, b) => a - b);
  });

  console.log("Ocene po predmetima:", this.uniqueSubjects);
}
  public getStudent() {
   this.student=history.state?.user || null;
  }

  getSubjectNames(): string[] {
    return Object.keys(this.uniqueSubjects);
  }

  // onCheckboxChange(absence: Absence, type: string): void {
  //  absence.excused = !absence.excused;
    
  // }
  onCheckboxChange(absence: Absence): void {
   absence.excused = !absence.excused;
    
  }
// saveAbsences(): void {
//   // Uzmi samo odsustva koja nisu zaključana i eventualno su promenjena
//   const updatedAbsences = this.absences.filter(absence => !absence.isfinal);

//   if (updatedAbsences.length === 0) {
//     console.log("Nema odsustava za ažuriranje.");
//     return;
//   }

//   // Napravi niz HTTP poziva za ažuriranje svakog odsustva
//   const updateRequests = updatedAbsences.map(absence => {
//     console.log("Ažuriram odsustvo:", JSON.stringify(absence, null, 2));
//     return this.absenceService.updateAbsences(absence);
//   });

//   // ForkJoin da sačeka da svi zahtevi budu završeni
//   forkJoin(updateRequests).subscribe({
//     next: () => {
//       console.log("Sva odsustva uspešno ažurirana.");
//       // Opcionalno: možeš osvežiti listu nakon uspešnog čuvanja
//       this.getAbsences();
//     },
//     error: (err) => {
//       console.error("Greška prilikom ažuriranja odsustava:", err);
//     }
//   });
// }
saveAbsences(): void {
  const updatedAbsences = this.absences.filter(absence => !absence.isfinal);

  if (updatedAbsences.length === 0) {
    console.log("Nema odsustava za ažuriranje.");
    return;
  }

  const updateRequests = updatedAbsences.map(absence => {
    console.log("Ažuriram odsustvo:", JSON.stringify(absence, null, 2));
    return this.absenceService.updateAbsences(absence);
  });

  forkJoin(updateRequests).subscribe({
    next: () => {
      console.log("Sva odsustva uspešno ažurirana.");
      // Tek sada osveži listu iz backenda
      this.getAbsences();
    },
    error: (err) => {
      console.error("Greška prilikom ažuriranja odsustava:", err);
    }
  });
}

  markOldAbsencesAsFinal(): void {
  const today = new Date();
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(today.getDate() - 15);

  this.absences.forEach(absence => {
    const absenceDate = absence.lesson?.date ? new Date(absence.lesson.date) : today;
    if (absenceDate < fifteenDaysAgo) {
      absence.isfinal = true;
    }
  });
}
  sortAbsencesByDateDesc(): void {
  this.absences.sort((a, b) => {
    const dateA = a.lesson?.date ? new Date(a.lesson.date).getTime() : 0;
    const dateB = b.lesson?.date ? new Date(b.lesson.date).getTime() : 0;
    return dateB - dateA; // Opadajući redosled (najnovije prvo)
  });
}
initPagination(): void {
  this.currentPage = 1;
  this.itemsPerPage = 10; // ili koliko već koristiš
  this.updatePaginatedAbsences();
}

updatePaginatedAbsences(): void {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  this.paginatedAbsences = this.absences.slice(startIndex, startIndex + this.itemsPerPage);
}

  }
  
  



