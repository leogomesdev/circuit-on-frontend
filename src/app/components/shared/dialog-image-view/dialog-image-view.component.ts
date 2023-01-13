import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppPropertiesService } from 'src/app/services/app-properties.service';
import { Image } from 'src/app/interfaces/api-responses/images/image.interface';
import { ImagesApiService } from 'src/app/services/api/images-api.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-dialog-image-view',
  templateUrl: './dialog-image-view.component.html',
  styleUrls: ['./dialog-image-view.component.css'],
})
export class DialogImageViewComponent implements OnInit, OnDestroy {
  private imagesApiServiceSubscription!: Subscription;
  image!: Image;

  constructor(
    @Inject(MAT_DIALOG_DATA) public imageRef: Image,
    private imagesApiService: ImagesApiService,
    private messageService: MessageService,
    public app: AppPropertiesService
  ) {}

  ngOnInit(): void {
    this.loadImageFromAPI();
  }

  ngOnDestroy(): void {
    if (this.imagesApiServiceSubscription) {
      this.imagesApiServiceSubscription.unsubscribe();
    }
  }

  /**
   * Connect to API to get image to show
   * @returns void
   */
  loadImageFromAPI(): void {
    if (this.imageRef?._id?.length === 0) {
      this.messageService.showError('Image _id is not defined');
    }
    if (this.imageRef?.data?.length > 0) {
      this.image = this.imageRef;
      return;
    }
    this.imagesApiServiceSubscription = this.imagesApiService
      .get(this.imageRef._id)
      .subscribe((apiData: Image) => {
        this.image = apiData;
      });
  }
}
