// src/app/pages/admin/manage/manage-user/manage-user.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../../service/user.service';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from '../../../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css'],
})
export class ManageUserComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  users: User[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Search
  searchKeyword = '';
  isSearching = false;

  // Modal/Form states
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedUser: User | null = null;

  // Form data
  userForm: CreateUserRequest = {
    username: '',
    email: '',
    roleName: 'ROLE_USER',
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

 
  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.users = Array.isArray(data.content) ? data.content : [];
          this.totalItems = data.totalElements || this.users.length;
          this.loading = false;
        },
        error: (error: string) => {
          this.error = error;
          this.loading = false;
          this.users = [];
        },
      });
  }

  refreshUsers(): void {
    this.currentPage = 1;
    this.searchKeyword = '';
    this.loadUsers();
  }


  searchUsers(): void {
    if (!this.searchKeyword.trim()) {
      this.loadUsers();
      return;
    }

    this.isSearching = true;
    this.error = null;

    this.userService
      .searchUsers(this.searchKeyword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: User[]) => {
          this.users = data;
          this.totalItems = data.length;
          this.isSearching = false;
        },
        error: (error: string) => {
          console.error('Error searching users:', error);
          this.error = error;
          this.isSearching = false;
        },
      });
  }


  openCreateModal(): void {
    this.resetForm();
    this.showCreateModal = true;
  }

 
  openEditModal(user: User): void {
    this.selectedUser = user;
    this.userForm = {
      username: user.username,
      email: user.email,
      roleName: 'ROLE_USER',
    };
    this.showEditModal = true;
  }

  openDeleteModal(user: User): void {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  createUser(): void {
    if (!this.validateForm()) return;

    this.loading = true;
    this.userService
      .createUser(this.userForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newUser: User) => {
          console.log('User created successfully:', newUser);
          this.showCreateModal = false;
          this.resetForm();
          this.loadUsers(); // Reload để lấy data mới nhất
        },
        error: (error: string) => {
          console.error('Error creating user:', error);
          this.error = error;
          this.loading = false;
        },
      });
  }

 
  updateUser(): void {
    if (!this.selectedUser || !this.validateForm()) return;

    const updateData: UpdateUserRequest = {
      id: this.selectedUser.id,
      ...this.userForm,
    };

    this.loading = true;
    this.userService
      .updateUser(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedUser: User) => {
          console.log('User updated successfully:', updatedUser);
          this.showEditModal = false;
          this.selectedUser = null;
          this.resetForm();
          this.loadUsers(); // Reload để lấy data mới nhất
        },
        error: (error: string) => {
          console.error('Error updating user:', error);
          this.error = error;
          this.loading = false;
        },
      });
  }

 
  deleteUser(): void {
    if (!this.selectedUser) return;

    this.loading = true;
    this.userService
      .deleteUser(this.selectedUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success: boolean) => {
          if (success) {
            this.closeModals(); // Đóng modal và reset form, selectedUser
            this.loadUsers(); // Cập nhật lại danh sách user
          }
          this.loading = false;
        },
        error: (error: string) => {
          this.error = error;
          this.loading = false;
        },
      });
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedUser = null;
    this.resetForm();
  }

  private resetForm(): void {
    this.userForm = {
      username: '',
      email: '',
      roleName: 'ROLE_USER',
    };
  }

  
  private validateForm(): boolean {
    if (!this.userForm.username.trim()) {
      this.error = 'Username không được để trống';
      return false;
    }
    if (!this.userForm.email.trim()) {
      this.error = 'Email không được để trống';
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userForm.email)) {
      this.error = 'Email không đúng định dạng';
      return false;
    }

    if (!this.userForm.roleName.trim()) {
      this.error = 'Role không được để trống';
      return false;
    }

    this.error = null;
    return true;
  }

  get paginatedUsers(): User[] {
    return Array.isArray(this.users)
      ? this.users.slice(
          (this.currentPage - 1) * this.itemsPerPage,
          this.currentPage * this.itemsPerPage
        )
      : [];
  }

  
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

 
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }

  get availableRoles(): string[] {
    return ['USER', 'ADMIN', 'MODERATOR'];
  }
}
