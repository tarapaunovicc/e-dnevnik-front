import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ClassRecordComponent } from './class-record/class-record.component';
import { StudentsComponent } from './students/students.component';
import { GradesComponent } from './grades/grades.component';
import { AbsencesComponent } from './absences/absences.component';
import { MyClassComponent } from './my-class/my-class.component';
import { StudentDetailsComponent } from './student-details/student-details.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'user',component: HomeComponent},
  {path: 'class/:class', component: ClassRecordComponent},
  {path:'students/:students',component:StudentsComponent},
  {path:'grades',component:GradesComponent},
  {path:'absences',component:AbsencesComponent},
  {path: 'myClass',component:MyClassComponent},
  {path: 'details', component:StudentDetailsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
