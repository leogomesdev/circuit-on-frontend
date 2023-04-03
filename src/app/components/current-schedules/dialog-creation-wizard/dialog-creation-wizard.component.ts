import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, Subscription } from 'rxjs';
import { ImagesApiService } from 'src/app/services/api/images-api.service';
import { ImagesByCategory } from 'src/app/interfaces/api-responses/images/images-by-category.interface';
import { MessageService } from 'src/app/services/message.service';
import { Schedule } from '../../../interfaces/api-responses/schedules/schedule.interface';
import { SchedulesApiService } from 'src/app/services/api/schedules-api.service';
import { CreateScheduleDto } from '../../schedules/dto/create-schedule.dto';
import { StepperOrientation } from '@angular/cdk/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  templateUrl: './dialog-creation-wizard.component.html',
  styleUrls: ['./dialog-creation-wizard.component.css'],
})
export class DialogCreationWizardComponent implements OnInit, OnDestroy {
  OPTION_SELECT_OLD = 'SELECT_OLD';
  OPTION_UPLOAD_NEW = 'UPLOAD_NEW';
  private imagesApiServiceSubscription!: Subscription;
  datetimePickerOptions = {
    minDate: this.yesterday(),
    defaultTime: [5, 50, 0],
    enableMeridian: true,
    touchUi: true,
    stepMinute: 5,
  };
  datetimeFormatOnSelectOption = 'EEE, MMM d z';

  actionButtonName = 'Save';
  @ViewChild('picker') picker!: string;

  scheduleForm!: FormGroup;

  imagesByCategoryList: ImagesByCategory[] = [];

  firstFormGroup = this.formBuilder.group({
    imageSelection: [this.OPTION_SELECT_OLD, [Validators.required]],
    imageId: [''],
  });
  secondFormGroup = this.formBuilder.group({
    scheduledAt: ['', Validators.required],
  });
  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public editData: Schedule,
    private formBuilder: FormBuilder,
    private scheduleApiService: SchedulesApiService,
    private imagesApiService: ImagesApiService,
    private dialogRef: MatDialogRef<DialogCreationWizardComponent>,
    private messageService: MessageService,
    breakpointObserver: BreakpointObserver
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.scheduleForm = this.formBuilder.group({
      scheduledAt: ['', Validators.required],
      imageId: ['', Validators.required],
    });

    if (this.editData?._id?.length > 0) {
      this.scheduleForm.controls['scheduledAt'].setValue(
        this.editData.scheduledAt
      );
      this.scheduleForm.controls['imageId'].setValue(this.editData.image._id);
      this.actionButtonName = 'Update';
    }

    this.getImagesForSelect();
  }

  ngOnDestroy(): void {
    if (this.imagesApiServiceSubscription) {
      this.imagesApiServiceSubscription.unsubscribe();
    }
  }

  /**
   * Send data through API to add a new Schedule
   * @param closeFormAfterSaving if should close modal after operation is done
   * @returns void
   */
  private addSchedule(closeFormAfterSaving: boolean): void {
    if (!this.scheduleForm.valid) {
      this.messageService.showError(
        'Please fill all the required fields',
        [],
        5
      );
      return;
    }
    const scheduleData = new CreateScheduleDto(
      this.scheduleForm.value['scheduledAt'],
      this.scheduleForm.value['imageId']
    );
    this.scheduleApiService.create(scheduleData).subscribe({
      next: () => {
        this.messageService.showSuccess('Schedule created successfully', 5);
        if (closeFormAfterSaving) {
          this.scheduleForm.reset();
          this.dialogRef.close('SAVE');
        }
      },
      error: (error) => {
        const errorMessage: string[] = error?.error?.message || error.message;
        this.messageService.showError(
          'Error while creating schedule',
          errorMessage,
          10
        );
      },
    });
  }

  /**
   * Send data through API to update an existing Schedule
   * @param closeFormAfterSaving if should close modal after operation is done
   * @returns void
   */
  private updateSchedule(closeFormAfterSaving: boolean): void {
    if (!this.scheduleForm.valid) {
      this.messageService.showError(
        'Please fill all the required fields',
        [],
        5
      );
      return;
    }
    const scheduleData = new CreateScheduleDto(
      this.scheduleForm.value['scheduledAt'],
      this.scheduleForm.value['imageId']
    );
    this.scheduleApiService.update(scheduleData, this.editData._id).subscribe({
      next: () => {
        this.messageService.showSuccess('Schedule updated successfully', 5);
        this.scheduleForm.reset();
        if (closeFormAfterSaving) {
          this.dialogRef.close('UPDATE');
        }
      },
      error: (error) => {
        const errorMessage: string[] = error?.error?.message || [error.message];
        this.messageService.showError(
          'Error while updating schedule',
          errorMessage,
          10
        );
      },
    });
  }

  /**
   * Get Yesterday date based on current date
   * @returns Date
   */
  private yesterday(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    return date;
  }

  /**
   * Connect to API to get list of images to show on the imageId field selector
   * @returns void
   */
  getImagesForSelect(): void {
    this.imagesApiServiceSubscription = this.imagesApiService
      .getGroupedByCategory()
      .subscribe((data: ImagesByCategory[]) => {
        this.imagesByCategoryList = data;
      });
  }

  /**
   * Use form data to add or update a Schedule
   * @param closeFormAfterSaving boolean
   * @returns void
   */
  addOrUpdateSchedule(closeFormAfterSaving = true): void {
    if (this.editData?._id?.length > 0) {
      return this.updateSchedule(closeFormAfterSaving);
    }

    return this.addSchedule(closeFormAfterSaving);
  }
}
