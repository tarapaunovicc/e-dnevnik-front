import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'e-dnevnik';
  showHeader: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader = event.url !== '/';
      }
    });
  }
  /*
  onSuccess(message: String){
    this.service.success('Sucess',message,{
      positiom: ['bottom','right'],
      timeOut:2000,
      animate:'fade',
      showProgressBar: true
    });
  }
    */
}
