import { Component } from '@angular/core';
import { WebSidebarComponent } from '../web-sidebar/web-sidebar.component';
import { RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from '../admin-header/admin-header/admin-header.component';

@Component({
  selector: 'app-web-layout',
  imports: [WebSidebarComponent,RouterOutlet, AdminHeaderComponent],
  templateUrl: './web-layout.component.html',
  styleUrl: './web-layout.component.css'
})
export class WebLayoutComponent {

}
