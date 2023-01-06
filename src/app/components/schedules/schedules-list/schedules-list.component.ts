import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DialogImageViewComponent } from '../../shared/dialog-image-view/dialog-image-view.component';
import { DialogScheduleComponent } from '../dialog-schedule/dialog-schedule.component';
import { MessageService } from 'src/app/services/message.service';
import { Schedule } from 'src/app/interfaces/schedule';
import { SchedulesApiService } from 'src/app/services/api/schedules-api.service';

@Component({
  selector: 'app-schedules-list',
  templateUrl: './schedules-list.component.html',
  styleUrls: ['./schedules-list.component.css'],
})
export class SchedulesListComponent implements OnInit, OnDestroy {
  private LONG_DATETIME_FORMAT = 'EEE, MMM d, y h:mm a z';
  private SHORT_DATETIME_FORMAT = 'EEE, MMM d HH:mm';

  private schedulesApiServiceListSubscription!: Subscription;
  private schedulesApiServiceDeleteSubscription!: Subscription;

  displayedColumns: string[] = [
    'scheduledAt',
    'image.title',
    'image.category',
    'image.backgroundColor',
    'action',
  ];
  pageSize = 25;
  screenWidth = 0;
  screenHeight = 0;
  filter = '';
  dateTimeFormat = this.LONG_DATETIME_FORMAT;
  isSmallScreen = false;
  displayOnlyFutureSchedules = true;
  dataSource!: MatTableDataSource<Schedule>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private schedulesApiService: SchedulesApiService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.checkWindowSize();
    this.updateListOfSchedules();
  }

  ngOnDestroy(): void {
    if (this.schedulesApiServiceListSubscription) {
      this.schedulesApiServiceListSubscription.unsubscribe();
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
    this.isSmallScreen = this.screenWidth <= 800;
    this.dateTimeFormat = this.isSmallScreen
      ? this.SHORT_DATETIME_FORMAT
      : this.LONG_DATETIME_FORMAT;
  }

  private onApiListSubscribe(data: Schedule[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.filter = '';
    this.filter = '';
    this.defineCustomSort();
    this.defineCustomFilter();
  }

  /**
   * Set default column for sorting
   * Set custom sorting to work with nested objects
   * @returns void
   */
  private defineCustomSort(): void {
    if (this.sort && !this.sort.active) {
      this.sort.sort({ id: 'scheduledAt', start: 'asc' } as MatSortable);
    }
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (
      row: Schedule,
      columnName: string
    ): string => {
      if (columnName == 'image.title') return row.image.title;
      if (columnName == 'image.category') return row.image.category;
      return row[columnName as keyof Schedule] as string;
    };
  }

  /**
   * Define custom filter to work with formatted info and nested objects
   * @returns void
   */
  private defineCustomFilter(): void {
    this.dataSource.filterPredicate = (record: Schedule, filter: string) => {
      const formattedDate = this.datePipe.transform(
        record.scheduledAt,
        this.dateTimeFormat
      );
      const data =
        `${record.image.category}${record.image.title}${record.scheduledAt}${formattedDate}`.toLowerCase();
      return data.includes(filter);
    };
  }

  /**
   * Fetch API to get schedules[]
   * @returns void
   */
  updateListOfSchedules(): void {
    if (this.schedulesApiServiceListSubscription) {
      this.schedulesApiServiceListSubscription.unsubscribe();
    }
    if (this.displayOnlyFutureSchedules) {
      this.schedulesApiServiceListSubscription = this.schedulesApiService
        .getAllFuture()
        .subscribe((data: Schedule[]) => this.onApiListSubscribe(data));
      return;
    }
    this.schedulesApiServiceListSubscription = this.schedulesApiService
      .getAll()
      .subscribe((data: Schedule[]) => this.onApiListSubscribe(data));
  }

  /**
   * Apply filter for the table element
   * @param event Event
   * @returns void
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
   * Open modal for updating a Schedule
   * @returns void
   */
  editSchedule(row: Schedule): void {
    this.dialog
      .open(DialogScheduleComponent, {
        data: row,
        width: '60%',
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'UPDATE') {
          this.updateListOfSchedules();
        }
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
  openDialogShowImage(imageId: string) {
    this.dialog.open(DialogImageViewComponent, {
      data: { _id: imageId },
      width: '80%',
    });
  }
}
