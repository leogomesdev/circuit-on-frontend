import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CreateImageDto } from '../dto/create-image.dto';
import { Image } from 'src/app/interfaces/image';
import { ImagesApiService } from 'src/app/services/api/images-api.service';
import { MessageService } from 'src/app/services/message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dialog-image',
  templateUrl: './dialog-image.component.html',
  styleUrls: ['./dialog-image.component.css'],
})
export class DialogImageComponent implements OnInit, OnDestroy {
  private imagesApiServiceSubscription!: Subscription;
  actionButtonName = 'Save';
  categoryOptions: string[] = environment.envVar.NG_APP_IMAGE_CATEGORIES.split(
    ','
  ).map((_) => _.trim());

  imageForm!: FormGroup;

  currentFile?: File;

  @ViewChild('picker') picker!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public editData: Image,
    private formBuilder: FormBuilder,
    private imagesApiService: ImagesApiService,
    private dialogRef: MatDialogRef<DialogImageComponent>,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.imageForm = this.formBuilder.group({
      category: ['', Validators.required],
      title: ['', Validators.required],
      fileName: ['', Validators.required],
      backgroundColor: [null],
    });

    if (this.editData?._id?.length > 0) {
      this.imageForm.controls['category'].setValue(this.editData.category);
      this.imageForm.controls['title'].setValue(this.editData.title);
      this.imageForm.controls['backgroundColor'].setValue(
        this.editData.backgroundColor
      );
      this.actionButtonName = 'Update';
    }
  }

  ngOnDestroy(): void {
    if (this.imagesApiServiceSubscription) {
      this.imagesApiServiceSubscription.unsubscribe();
    }
  }
  /**
   * When a file is selected for upload, check its filetype
   * @param event
   * @returns void
   */
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  onFileSelected(event: any): void {
    if (event?.target?.files && event?.target?.files[0]) {
      const file: File = event.target.files[0];
      const regex = new RegExp('image/jpeg|image/png');
      if (!regex.test(file.type)) {
        this.messageService.showError(
          'Please upload a JPEG or PNG image',
          [],
          15
        );
        this.currentFile = undefined;
        this.imageForm.value['fileName'] = undefined;
        return;
      }
      this.currentFile = file;
      this.imageForm.value['fileName'] = file.name;
    }
  }

  /**
   * Send data through API to add a new Image
   * @param closeFormAfterSaving if should close modal after operation is done
   * @returns void
   */
  private addImage(closeFormAfterSaving: boolean): void {
    if (!this.imageForm.valid || !this.currentFile) {
      this.messageService.showError(
        'Please fill all the required fields',
        [],
        5
      );
      return;
    }
    const imageData = new CreateImageDto(
      this.imageForm.value['category'].trim(),
      this.imageForm.value['title'].trim(),
      this.imageForm.value['backgroundColor']
    );
    this.imagesApiService.create(this.currentFile, imageData).subscribe({
      next: () => {
        this.messageService.showSuccess('Image created successfully', 5);
        this.imageForm.reset();
        if (closeFormAfterSaving) {
          this.dialogRef.close('SAVE');
        }
      },
      error: (error) => {
        const errorMessage: string[] = error?.error?.message || error.message;
        this.messageService.showError(
          'Error while creating image',
          errorMessage,
          10
        );
      },
    });
  }

  /**
   * Send data through API to update an existing Image
   * @param closeFormAfterSaving if should close modal after operation is done
   * @returns void
   */
  private updateImage(closeFormAfterSaving: boolean): void {
    if (!this.imageForm.valid) {
      this.messageService.showError(
        'Please fill all the required fields',
        [],
        5
      );
      return;
    }
    const imageData = new CreateImageDto(
      this.imageForm.value['category'],
      this.imageForm.value['title'],
      this.imageForm.value['backgroundColor']
    );
    this.imagesApiService.update(imageData, this.editData._id).subscribe({
      next: () => {
        this.messageService.showSuccess('Image updated successfully', 5);
        this.imageForm.reset();
        if (closeFormAfterSaving) {
          this.dialogRef.close('UPDATE');
        }
      },
      error: (error) => {
        const errorMessage: string[] = error?.error?.message || [error.message];
        this.messageService.showError(
          'Error while updating image',
          errorMessage,
          10
        );
      },
    });
  }

  /**
   * Use form data to add or update a Image
   * @param closeFormAfterSaving boolean
   * @returns void
   */
  addOrUpdateImage(closeFormAfterSaving = true): void {
    if (this.editData?._id?.length > 0) {
      return this.updateImage(closeFormAfterSaving);
    }

    return this.addImage(closeFormAfterSaving);
  }
}
