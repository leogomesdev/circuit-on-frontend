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
import { DialogImageComponent } from '../dialog-image/dialog-image.component';
import { MessageService } from 'src/app/services/message.service';
import { Image } from 'src/app/interfaces/image';
import { ImagesApiService } from 'src/app/services/api/images-api.service';

@Component({
  selector: 'app-images-list',
  templateUrl: './images-list.component.html',
  styleUrls: ['./images-list.component.css'],
})
export class ImagesListComponent implements OnInit, OnDestroy {
  private LONG_DATETIME_FORMAT = 'EEE, MMM d, y h:mm a z';
  private SHORT_DATETIME_FORMAT = 'EEE, MMM d HH:mm';

  private imagesApiServiceListSubscription!: Subscription;
  private imagesApiServiceDeleteSubscription!: Subscription;

  displayedColumns: string[] = [
    'category',
    'title',
    'backgroundColor',
    'updatedAt',
    'action',
  ];
  pageSize = 10;
  screenWidth = 0;
  screenHeight = 0;
  filter = '';
  dateTimeFormat = this.LONG_DATETIME_FORMAT;
  isSmallScreen = false;
  dataSource!: MatTableDataSource<Image>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private imagesApiService: ImagesApiService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.checkWindowSize();
    this.updateListOfImages();
  }

  ngOnDestroy(): void {
    if (this.imagesApiServiceListSubscription) {
      this.imagesApiServiceListSubscription.unsubscribe();
    }
    if (this.imagesApiServiceDeleteSubscription) {
      this.imagesApiServiceDeleteSubscription.unsubscribe();
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

  /**
   * Fetch API to get images[]
   * @returns void
   */
  private updateListOfImages(): void {
    if (this.imagesApiServiceListSubscription) {
      this.imagesApiServiceListSubscription.unsubscribe();
    }
    this.imagesApiServiceListSubscription = this.imagesApiService
      .getAll()
      .subscribe((data: Image[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.filter = '';
        this.filter = '';
        this.defineCustomSort();
        this.defineCustomFilter();
      });
  }

  /**
   * Set default column for sorting
   * Set custom sorting to work with nested objects
   * @returns void
   */
  private defineCustomSort(): void {
    if (this.sort && !this.sort.active) {
      this.sort.sort({ id: 'updatedAt', start: 'desc' } as MatSortable);
    }
    this.dataSource.sort = this.sort;
  }

  /**
   * Define custom filter to work with formatted info and nested objects
   * @returns void
   */
  private defineCustomFilter(): void {
    this.dataSource.filterPredicate = (record: Image, filter: string) => {
      const formattedDate = this.datePipe.transform(
        record.updatedAt,
        this.dateTimeFormat
      );
      const data =
        `${record.category}${record.title}${record.updatedAt}${formattedDate}`.toLowerCase();
      return data.includes(filter);
    };
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
   * Open modal for creating a Image
   * @returns void
   */
  openDialog() {
    this.dialog
      .open(DialogImageComponent, {
        width: this.isSmallScreen ? '98%' : '60%',
        maxWidth: '98vw',
      })
      .afterClosed()
      .subscribe(() => {
        this.updateListOfImages();
      });
  }

  /**
   * Open modal for updating a Image
   * @returns void
   */
  editImage(row: Image): void {
    this.dialog
      .open(DialogImageComponent, {
        data: row,
        width: this.isSmallScreen ? '98%' : '60%',
        maxWidth: '98vw',
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'UPDATE') {
          this.updateListOfImages();
        }
      });
  }
  /**
   * Deletes a image
   * @returns void
   */
  deleteImage(_id: string): void {
    if (this.imagesApiServiceDeleteSubscription) {
      this.imagesApiServiceDeleteSubscription.unsubscribe();
    }
    this.imagesApiServiceDeleteSubscription = this.imagesApiService
      .delete(_id)
      .subscribe({
        next: () => {
          this.messageService.showSuccess('Image deleted successfully', 5);
          this.updateListOfImages();
        },
        error: (error) => {
          const errorMessage: string[] = error?.error?.message || error.message;
          this.messageService.showError(
            'Error while deleting image',
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
  openDialogShowImage(image: Image) {
    this.dialog.open(DialogImageViewComponent, {
      data: image,
      width: this.isSmallScreen ? '98%' : '80%',
      maxWidth: '98vw',
    });
  }
}
