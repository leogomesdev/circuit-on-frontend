import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppPropertiesService } from 'src/app/services/app-properties.service';
import { CurrentSchedule } from 'src/app/interfaces/api-responses/current-schedules/current-schedule.interface';
import { CurrentSchedulesApiService } from 'src/app/services/api/current-schedules-api.service';
import { DialogCreationWizardComponent } from '../dialog-creation-wizard/dialog-creation-wizard.component';
import { DialogImageViewComponent } from 'src/app/components/shared/dialog-image-view/dialog-image-view.component';
import { environment } from 'src/environments/environment';
import { MessageService } from 'src/app/services/message.service';
import { SchedulesApiService } from 'src/app/services/api/schedules-api.service';

@Component({
  selector: 'app-current-schedule-list',
  templateUrl: './current-schedule-list.component.html',
  styleUrls: ['./current-schedule-list.component.css'],
})
export class CurrentScheduleListComponent implements OnInit, OnDestroy {
  private currentSchedulesApiServiceListSubscription!: Subscription;
  private schedulesApiServiceDeleteSubscription!: Subscription;

  maxFutureItems = Number(environment.envVar.NG_APP_LIST_PAGE_FUTURE_ITEMS);

  currentScheduleList: CurrentSchedule[] = [];

  constructor(
    private schedulesApiService: SchedulesApiService,
    private currentSchedulesApiService: CurrentSchedulesApiService,
    private dialog: MatDialog,
    private messageService: MessageService,
    public app: AppPropertiesService
  ) {}

  ngOnInit(): void {
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
        .getAll(this.maxFutureItems)
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
      .open(DialogCreationWizardComponent, {
        width: this.app.modalWidth,
        maxWidth: this.app.modalMaxWidth,
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
      width: this.app.modalWidth,
      maxWidth: this.app.modalMaxWidth,
    });
  }
}
