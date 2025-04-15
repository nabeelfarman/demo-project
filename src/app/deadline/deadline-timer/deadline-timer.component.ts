import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { DeadlineService } from '../deadline.service';
import { BehaviorSubject, interval, switchMap, map, takeWhile, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-deadline-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deadline-timer.component.html',
  styleUrl: './deadline-timer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeadlineTimerComponent implements OnInit {
  secondsLeft$ = new BehaviorSubject<number | null>(null);

  constructor(private deadlineService: DeadlineService) { }

  ngOnInit(): void {
    this.getDeadline();
  }

  getDeadline() {
    this.deadlineService.getDeadline().pipe(
      switchMap(({ secondsLeft }) =>
        interval(1000).pipe(
          map(elapsed => secondsLeft - elapsed),
          takeWhile(remaining => remaining >= 0),
          tap(remaining => this.secondsLeft$.next(remaining))
        )
      )
    ).subscribe();
  }
}