import { Component, OnInit } from '@angular/core';
import { AdminSidebarComponent } from './pages/admin/component/admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from './pages/admin/component/admin-header/admin-header/admin-header.component';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'CINEMA';
  currentRoute = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
  }

  isLoginPage(): boolean {
    return (
      this.currentRoute === '/login' ||
      this.currentRoute === '' ||
      this.currentRoute === '/'
    );
  }
}
