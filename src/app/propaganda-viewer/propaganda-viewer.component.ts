import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CurrentSchedule } from '../interfaces/current-schedule';
import { ApiClientService } from '../services/api-client.service';

@Component({
  templateUrl: './propaganda-viewer.component.html',
  styleUrls: ['./propaganda-viewer.component.css'],
})
export class PropagandaViewerComponent implements OnInit, OnDestroy {
  imageSource = '';
  backgroundColor = '';
  // 86400 seconds in a day
  private msInSevenDays = 86400 * 1000 * 7;

  private apiClientServiceSubscription!: Subscription;

  constructor(private apiClientService: ApiClientService) {}

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
      console.log('Nothing on the schedule');
      return;
    }
    const currentTimestamp: number = new Date().getTime();

    apiDataList.map((scheduleData: CurrentSchedule) => {
      const targetTimestamp: number = new Date(
        scheduleData.scheduledTime
      ).getTime();
      const timeout: number = targetTimestamp - currentTimestamp;

      if (timeout > this.msInSevenDays) {
        console.log(
          `Item is scheduled for > than 7 days, skipping it to fit into 32-bit signed integer. == image: ${scheduleData.title}`
        );
      } else {
        this.scheduleItem(scheduleData, timeout);
      }
    });
  }

  private scheduleItem(scheduleData: CurrentSchedule, timeout: number) {
    if (timeout <= 0) {
      console.log(`Replacing current image now`);
      this.updatePropagandaOnDisplay(scheduleData);
      return;
    }
    console.log(
      `Scheduling for: ${scheduleData.scheduledTime} == within ${Math.round(
        timeout / 1000 / 60
      )} minutes == image: ${scheduleData.title}`
    );
    setTimeout(() => {
      console.log(`Replacing image`);
      this.updatePropagandaOnDisplay(scheduleData);
    }, timeout);
  }

  private updatePropagandaOnDisplay(scheduleData: CurrentSchedule) {
    console.log(`Replacing image with ${scheduleData.title}`);
    this.imageSource = scheduleData.data;
    if (scheduleData.backgroundColor && scheduleData.backgroundColor !== '') {
      this.backgroundColor = scheduleData.backgroundColor;
    }
  }
}
