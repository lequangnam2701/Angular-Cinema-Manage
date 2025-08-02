import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from '../../../../models/menu-item.model';
@Component({
  selector: 'app-web-sidebar',
  imports: [CommonModule],
  templateUrl: './web-sidebar.component.html',
  styleUrl: './web-sidebar.component.css',
})
export class WebSidebarComponent {
  menuItems: MenuItem[] = [
    {
      path: '/movie',
      label: 'Movies',
      icon: '🎬',
    },
    {
      path: '/cinema',
      label: 'Cinema',
      icon: '🎥',
    },
  ];
  constructor(private router: Router) {}

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  handleClick() {
    console.log('=============');
  }
}
