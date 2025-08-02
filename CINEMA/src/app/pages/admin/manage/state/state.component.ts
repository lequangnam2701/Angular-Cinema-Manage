// import { Component } from '@angular/core';
// import { StatesService } from '../../../../service/state.service';

// @Component({
//   selector: 'app-state',
//   imports: [],
//   templateUrl: './state.component.html',
//   styleUrl: './state.component.css'
// })
// export class StateComponent {
//   states: any[] = [];
//   loading = false;
//   error: string | null = null;
//   newStateName = '';

//   constructor(private statesService: StatesService) {}

//   ngOnInit() {
//     this.loadStates();
//   }

//   loadStates() {
//     this.loading = true;
//     this.error = null;

//     this.statesService.getStates().subscribe({
//       next: (states) => {
//         this.states = states;
//         this.loading = false;
//       },
//       error: (err) => {
//         this.error = 'Failed to load states: ' + err.message;
//         this.loading = false;
//       }
//     });
//   }

//   addState() {
//     if (!this.newStateName.trim()) return;

//     this.statesService.createState({ name: this.newStateName.trim() }).subscribe({
//       next: (newState) => {
//         this.states.push(newState);
//         this.newStateName = '';
//       },
//       error: (err) => {
//         this.error = 'Failed to add state: ' + err.message;
//       }
//     });
//   }

//   deleteState(id: number): void {
//     this.statesService.deleteState(id).subscribe({
//       next: () => {
//         this.states = this.states.filter(state => state.id !== id);
//       },
//       error: (err) => {
//         this.error = 'Failed to delete state: ' + err.message;
//       }
//     });
//   }
// }
