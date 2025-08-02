import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css'],
})
export class AdminSidebarComponent {
  currentRoute: string = '';

  menuItems: MenuItem[] = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/movies', label: 'Movies', icon: '🎬' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/CinemaManager', label: 'Cinemas', icon: '🎭' },
    { path: '/admin/showing-times', label: 'Showing Time', icon: '⏰' },
    { path: '/admin/features', label: 'Features', icon: '✨' },
    { path: '/admin/theatres', label: 'Theatres', icon: '🏢' },
    { path: '/admin/state', label: 'State', icon: '🌍' },
    { path: '/admin/feature-types', label: 'Feature-types', icon: '🔧' },
    { path: 'admin/snack', label: 'Snack', icon: '🛒' },
  ];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });

    this.currentRoute = this.router.url;
  }

  isActive(path: string): boolean {
    if (path === '/admin') {
      return this.currentRoute === '/admin';
    }
    return this.currentRoute.startsWith(path);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
