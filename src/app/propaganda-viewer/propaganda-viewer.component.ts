import {
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Inject,
  InjectionToken,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Subscription } from 'rxjs';
import { CurrentSchedule } from '../interfaces/current-schedule';
import { ApiClientService } from '../services/api-client.service';
import { MessageService } from '../services/message.service';

@Component({
  templateUrl: './propaganda-viewer.component.html',
  styleUrls: ['./propaganda-viewer.component.css'],
})
export class PropagandaViewerComponent implements OnInit, OnDestroy {
  private isServer = false;
  imageSource = '/assets/images/placeholder.jpg';
  backgroundColor = '#000000';
  // 86400 seconds in a day
  private msInSevenDays = 86400 * 1000 * 7;

  private apiClientServiceSubscription!: Subscription;

  constructor(
    private apiClientService: ApiClientService,
    @Inject(PLATFORM_ID) platformID: InjectionToken<unknown>,
    public messageService: MessageService
  ) {
    this.isServer = isPlatformServer(platformID);
  }

  ngOnInit(): void {
    this.apiClientServiceSubscription = this.apiClientService
      .getDataToDisplay()
      .subscribe((res: CurrentSchedule[]) => {
        this.scheduleChangesBasedOnAPI(res);
      });
  }

  ngOnDestroy(): void {
    this.apiClientServiceSubscription.unsubscribe();
  }

  scheduleChangesBasedOnAPI(apiDataList: CurrentSchedule[]) {
    if (apiDataList.length === 0) {
      this.messageService.addMessage('Nothing on the schedule');
      return;
    }
    const currentTimestamp: number = new Date().getTime();

    apiDataList.map((scheduleData: CurrentSchedule) => {
      const targetTimestamp: number = new Date(
        scheduleData.scheduledTime
      ).getTime();
      const timeout: number = targetTimestamp - currentTimestamp;

      if (timeout > this.msInSevenDays) {
        this.messageService.addMessage(
          `Item is scheduled for > than 7 days, skipping it to fit into 32-bit signed integer. == image: ${scheduleData.title}`
        );
      } else {
        this.scheduleItem(scheduleData, timeout);
      }
    });
  }

  private scheduleItem(scheduleData: CurrentSchedule, timeout: number) {
    if (timeout <= 0) {
      this.messageService.addMessage(`Replacing current image now`);
      this.updatePropagandaOnDisplay(scheduleData);
      return;
    }
    if (this.isServer) {
      this.messageService.addMessage(
        `It is running on server. Skipping, browser will render it.`
      );
      return;
    }

    const minutes: number = Math.round(timeout / 1000 / 60);
    this.messageService.addMessage(
      `Scheduling for: ${scheduleData.scheduledTime} == within ${minutes} minutes == image: ${scheduleData.title}`
    );
    setTimeout(() => {
      this.updatePropagandaOnDisplay(scheduleData);
    }, timeout);
  }

  private updatePropagandaOnDisplay(scheduleData: CurrentSchedule) {
    this.messageService.addMessage(
      `Replacing image with ${scheduleData.title}`
    );
    this.imageSource = scheduleData.data;
    if (scheduleData.backgroundColor && scheduleData.backgroundColor !== '') {
      this.backgroundColor = scheduleData.backgroundColor;
    }
  }
}
