import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SchedulesApiService } from '../../../services/api/schedules-api.service';
import { Schedule } from '../../../interfaces/schedule';
import { DialogScheduleComponent } from '../dialog-schedule/dialog-schedule.component';

@Component({
  selector: 'app-schedules-list',
  templateUrl: './schedules-list.component.html',
  styleUrls: ['./schedules-list.component.css'],
})
export class SchedulesListComponent implements OnInit {
  displayedColumns: string[] = [
    'scheduledAt',
    'title',
    'category',
    'backgroundColor',
    'action',
  ];
  dataSource!: MatTableDataSource<Schedule>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private schedulesApiService: SchedulesApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getListOfSchedules();
  }

  getListOfSchedules() {
    // @TODO drop subscriptions on destroying
    this.schedulesApiService.getAllFuture().subscribe((data: Schedule[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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
          this.getListOfSchedules();
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
          this.getListOfSchedules();
        }
      });
  }

  deleteSchedule(_id: string) {
    this.schedulesApiService.delete(_id).subscribe({
      next: () => {
        alert('Schedule deleted successfully');
        this.getListOfSchedules();
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
