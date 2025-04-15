import { Routes } from '@angular/router';
import { DeadlineTimerComponent } from './deadline/deadline-timer/deadline-timer.component';
import { CameraCoverageComponent } from './camera-coverage/camera-coverage.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'deadline',
        pathMatch: 'full'
    },
    {
        path: 'deadline',
        component: DeadlineTimerComponent
    },
    {
        path: 'coverage',
        component: CameraCoverageComponent
    }
];
