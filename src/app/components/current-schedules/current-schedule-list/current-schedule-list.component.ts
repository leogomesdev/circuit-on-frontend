import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CurrentSchedule } from '../../../interfaces/current-schedule';
import { CurrentSchedulesApiService } from 'src/app/services/api/current-schedules-api.service';
import { DialogImageViewComponent } from '../../shared/dialog-image-view/dialog-image-view.component';
import { DialogScheduleComponent } from '../../schedules/dialog-schedule/dialog-schedule.component';
import { MessageService } from 'src/app/services/message.service';
import { SchedulesApiService } from 'src/app/services/api/schedules-api.service';

@Component({
  selector: 'app-current-schedule-list',
  templateUrl: './current-schedule-list.component.html',
  styleUrls: ['./current-schedule-list.component.css'],
})
export class CurrentScheduleListComponent implements OnInit, OnDestroy {
  private LONG_DATETIME_FORMAT = 'EEE, MMM d, y h:mm a z';
  private SHORT_DATETIME_FORMAT = 'EEE, MMM d HH:mm';

  private currentSchedulesApiServiceListSubscription!: Subscription;
  private schedulesApiServiceDeleteSubscription!: Subscription;
  screenWidth = 0;
  screenHeight = 0;
  dateTimeFormat = this.LONG_DATETIME_FORMAT;
  isSmallScreen = false;

  currentScheduleList: CurrentSchedule[] = [];

  constructor(
    private schedulesApiService: SchedulesApiService,
    private currentSchedulesApiService: CurrentSchedulesApiService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.checkWindowSize();
    this.updateListOfSchedules();
  }

  ngOnDestroy(): void {
    if (this.currentSchedulesApiServiceListSubscription) {
      this.currentSchedulesApiServiceListSubscription.unsubscribe();
    }
    if (this.schedulesApiServiceDeleteSubscription) {
      this.schedulesApiServiceDeleteSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.checkWindowSize();
  }

  /**
   * If screen is small, this info is useful for formating datetime fields
   * @returns void
   */
  private checkWindowSize(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.isSmallScreen = this.screenWidth < 800;
    this.dateTimeFormat =
      this.screenWidth < 800
        ? this.SHORT_DATETIME_FORMAT
        : this.LONG_DATETIME_FORMAT;
  }

  /**
   * Fetch API to get CurrentSchedule[]
   * @returns void
   */
  updateListOfSchedules(): void {
    if (this.currentSchedulesApiServiceListSubscription) {
      this.currentSchedulesApiServiceListSubscription.unsubscribe();
    }
    this.currentSchedulesApiServiceListSubscription =
      this.currentSchedulesApiService
        .getAll()
        .subscribe((data: CurrentSchedule[]) => {
          this.currentScheduleList = data;
        });
  }

  /**
   * Open modal for creating a Schedule
   * @returns void
   */
  openDialog() {
    this.dialog
      .open(DialogScheduleComponent, {
        width: '60%',
      })
      .afterClosed()
      .subscribe(() => {
        this.updateListOfSchedules();
      });
  }

  /**
   * Deletes a schedule
   * @returns void
   */
  deleteSchedule(_id: string): void {
    if (this.schedulesApiServiceDeleteSubscription) {
      this.schedulesApiServiceDeleteSubscription.unsubscribe();
    }
    this.schedulesApiServiceDeleteSubscription = this.schedulesApiService
      .delete(_id)
      .subscribe({
        next: () => {
          this.messageService.showSuccess('Schedule deleted successfully', 5);
          this.updateListOfSchedules();
        },
        error: (error) => {
          const errorMessage: string[] = error?.error?.message || error.message;
          this.messageService.showError(
            'Error while deleting schedule',
            errorMessage,
            10
          );
        },
      });
  }

  /**
   * Open modal for displaying an image
   * @returns void
   */
  openDialogShowImage(currentSchedule: CurrentSchedule) {
    this.dialog.open(DialogImageViewComponent, {
      data: {
        _id: currentSchedule.imageId,
        category: currentSchedule.category,
        title: currentSchedule.title,
        backgroundColor: currentSchedule.backgroundColor,
        data: currentSchedule.data,
      },
      width: '80%',
    });
  }
}
