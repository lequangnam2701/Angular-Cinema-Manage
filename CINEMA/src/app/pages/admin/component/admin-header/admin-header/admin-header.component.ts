import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css',
})
export class AdminHeaderComponent implements OnInit {
  username: string = '';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        this.username = storedUsername;
      }
    }
  }
  handleLogout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('username');
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }
}
