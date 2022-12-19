import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { Schedule } from '../../../interfaces/schedule';
import { Image } from 'src/app/interfaces/image';
import { ImagesApiService } from 'src/app/services/api/images-api.service';
import { SchedulesApiService } from 'src/app/services/api/schedules-api.service';

@Component({
  selector: 'app-dialog-schedule',
  templateUrl: './dialog-schedule.component.html',
  styleUrls: ['./dialog-schedule.component.css'],
})
export class DialogScheduleComponent implements OnInit {
  public minDate: Date = this.yesterday();
  public defaultTime = [5, 45, 0];
  public enableMeridian = true;
  public touchUi = true;
  actionButtonName = 'Save';
  @ViewChild('picker') picker: any;

  scheduleForm!: FormGroup;

  imagesList: Image[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public editData: Schedule,
    private formBuilder: FormBuilder,
    private scheduleApiService: SchedulesApiService,
    private imagesApiService: ImagesApiService,
    private dialogRef: MatDialogRef<DialogScheduleComponent>
  ) {}

  ngOnInit() {
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

  getImagesForSelect() {
    // @TODO drop subscriptions on destroying
    this.imagesApiService.getAll().subscribe((data: Image[]) => {
      this.imagesList = data.sort((a, b) =>
        a.createdAt > b.createdAt ? -1 : 1
      );
    });
  }

  addOrUpdateSchedule(closeFormAfterSaving = true) {
    if (this.editData?._id?.length > 0) {
      return this.updateSchedule(closeFormAfterSaving);
    }

    return this.addSchedule(closeFormAfterSaving);
  }

  addSchedule(closeFormAfterSaving: boolean) {
    if (this.scheduleForm.valid) {
      const scheduleData = new CreateScheduleDto(
        this.scheduleForm.value['scheduledAt'],
        this.scheduleForm.value['imageId']
      );
      this.scheduleApiService.create(scheduleData).subscribe({
        next: () => {
          alert('Schedule created successfully');
          this.scheduleForm.reset();
          if (closeFormAfterSaving) {
            this.dialogRef.close('SAVE');
          }
        },
        error: (error) => {
          if (error.status === 400) {
            alert(error.error.message);
          } else {
            alert('Error while creating schedule');
          }
        },
      });
    }
  }

  updateSchedule(closeFormAfterSaving: boolean) {
    if (this.scheduleForm.valid) {
      const scheduleData = new CreateScheduleDto(
        this.scheduleForm.value['scheduledAt'],
        this.scheduleForm.value['imageId']
      );
      this.scheduleApiService
        .update(scheduleData, this.editData._id)
        .subscribe({
          next: () => {
            alert('Schedule updated successfully');
            this.scheduleForm.reset();
            if (closeFormAfterSaving) {
              this.dialogRef.close('UPDATE');
            }
          },
          error: (error) => {
            if (error.status === 400) {
              alert(error.error.message);
            } else {
              alert('Error while updating schedule');
            }
          },
        });
    }
  }

  yesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    return date;
  }
}
