import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SchedulesApiService } from '../../../services/api/schedules-api.service';
import { Schedule } from '../../../interfaces/schedule';
import { DialogScheduleComponent } from '../dialog-schedule/dialog-schedule.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-schedules-list',
  templateUrl: './schedules-list.component.html',
  styleUrls: ['./schedules-list.component.css'],
})
export class SchedulesListComponent implements OnInit {
  private LONG_DATETIME_FORMAT = 'EEE, MMM d, y h:mm a z';
  private SHORT_DATETIME_FORMAT = 'EEE, MMM d HH:mm';

  displayedColumns: string[] = [
    'scheduledAt',
    'image.title',
    'image.category',
    'image.backgroundColor',
    'action',
  ];
  pageSize = 10;
  screenWidth = 0;
  screenHeight = 0;
  filter = '';
  dateTimeFormat = this.LONG_DATETIME_FORMAT;
  dataSource!: MatTableDataSource<Schedule>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private schedulesApiService: SchedulesApiService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.checkWindowSize();
    this.updateListOfSchedules();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.checkWindowSize();
  }

  private checkWindowSize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    console.log('this.screenWidth: ' + this.screenWidth);
    this.dateTimeFormat =
      this.screenWidth < 800
        ? this.SHORT_DATETIME_FORMAT
        : this.LONG_DATETIME_FORMAT;
  }

  private updateListOfSchedules() {
    // @TODO drop subscriptions on destroying
    this.schedulesApiService.getAllFuture().subscribe((data: Schedule[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.filter = '';
      this.filter = '';
      this.defineCustomSort();
      this.defineCustomFilter();
    });
  }

  private defineCustomSort() {
    if (!this.sort.active) {
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

  private defineCustomFilter() {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog() {
    this.dialog
      .open(DialogScheduleComponent, {
        width: '60%',
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'SAVE') {
          this.updateListOfSchedules();
        }
      });
  }

  editSchedule(row: Schedule) {
    this.dialog
      .open(DialogScheduleComponent, {
        data: row,
        width: '60%',
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'SAVE') {
          this.updateListOfSchedules();
        }
      });
  }

  deleteSchedule(_id: string) {
    this.schedulesApiService.delete(_id).subscribe({
      next: () => {
        alert('Schedule deleted successfully');
        this.updateListOfSchedules();
      },
      error: (error) => {
        if (error.status === 400) {
          alert(error.error.message);
        } else {
          alert('Error while deleting schedule');
        }
      },
    });
  }
}
