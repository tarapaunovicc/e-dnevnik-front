import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ClassRecordComponent } from './class-record/class-record.component';
import { StudentsComponent } from './students/students.component';
import { AbsencesComponent } from './absences/absences.component';
import { GradesComponent } from './grades/grades.component';
import { MyClassComponent } from './my-class/my-class.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { NotificationComponent } from './notification/notification.component';
import { AuthInterceptor } from './security/auth.interceptor';
import { AuthenticationService } from './security/authentication.service';
import { ErrorInterceptor } from './security/error.interceptor';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    ClassRecordComponent,
    StudentsComponent,
    AbsencesComponent,
    GradesComponent,
    MyClassComponent,
    StudentDetailsComponent,
    NotificationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    HttpClientModule,
    //BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule 
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      deps: [AuthenticationService],
      multi: true,
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      deps: [ AuthenticationService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
