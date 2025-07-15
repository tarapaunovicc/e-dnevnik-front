import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: string[] = [];
  private notificationsSubject = new BehaviorSubject<string[]>(this.notifications);

  notifications$ = this.notificationsSubject.asObservable();

  addNotification(message: string) {
    this.notifications.push(message);
    this.notificationsSubject.next([...this.notifications]);

    // Automatski uklanja poruku nakon 5 sekundi
    setTimeout(() => this.removeNotification(message), 2000);
  }

  removeNotification(message: string) {
    this.notifications = this.notifications.filter(notif => notif !== message);
    this.notificationsSubject.next([...this.notifications]);
  }
}
