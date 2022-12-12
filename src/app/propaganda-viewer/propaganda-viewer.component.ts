import {
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Inject,
  InjectionToken,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { CurrentSchedule } from '../interfaces/current-schedule';
import { ApiClientService } from '../services/api-client.service';
import { MessageService } from '../services/message.service';
import { NextSchedule } from '../interfaces/next-schedule';

@Component({
  templateUrl: './propaganda-viewer.component.html',
  styleUrls: ['./propaganda-viewer.component.css'],
})
export class PropagandaViewerComponent implements OnInit, OnDestroy {
  private isBrowser = true;
  imageSource = '/assets/images/placeholder.jpg';
  backgroundColor = '#000000';
  public nextSchedules: NextSchedule[] = [];

  // 86400 seconds in a day
  private msInSevenDays = 86400 * 1000 * 7;

  private apiClientServiceSubscription!: Subscription;

  constructor(
    private apiClientService: ApiClientService,
    @Inject(PLATFORM_ID) platformID: InjectionToken<unknown>,
    public messageService: MessageService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformID);
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

  private scheduleChangesBasedOnAPI(apiDataList: CurrentSchedule[]) {
    if (apiDataList.length === 0) {
      this.messageService.addMessage('Nothing on current or the schedule');
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
        this.defineNextItems(scheduleData, timeout);
      }
    });

    this.scheduleNextItems();
  }

  private defineNextItems(scheduleData: CurrentSchedule, timeout: number) {
    if (timeout <= 0) {
      this.updatePropagandaOnDisplay({
        ...scheduleData,
        timeout: 0,
        backgroundColor: scheduleData.backgroundColor || '',
      });
      return;
    }

    const minutes: number = Math.round(timeout / 1000 / 60);
    this.messageService.addMessage(
      `Scheduling for: ${scheduleData.scheduledTime} == within ${minutes} minutes == image: ${scheduleData.title}`
    );

    this.nextSchedules.push({
      data: scheduleData.data,
      title: scheduleData.title,
      backgroundColor: scheduleData.backgroundColor || '',
      timeout,
    });
  }

  private scheduleNextItems() {
    if (this.nextSchedules.length === 0) {
      this.messageService.addMessage('Nothing on future schedule');
      return;
    }

    if (this.isBrowser && false) {
      this.messageService.addMessage(
        `It is running on browser. Setting timeouts now.`
      );
      this.nextSchedules.map((nextSchedule) => {
        setTimeout(() => {
          this.updatePropagandaOnDisplay(nextSchedule);
        }, nextSchedule.timeout);
      });
      return;
    }

    this.messageService.addMessage(
      `It is running on server. Setting timeouts using legacy scripts`
    );
    this.setNextSchedulesForOldBrowsers();
  }

  /**
   * It is required for running on old TVs browsers
   * https://stackoverflow.com/questions/38088996/adding-script-tags-in-angular-component-template
   */
  private setNextSchedulesForOldBrowsers() {
    const content: string = this.nextSchedules
      .map(
        (nextSchedule) => `setTimeout(() => {
          document.getElementById("current-propaganda-img").src = "${nextSchedule.data}";
          if("${nextSchedule.backgroundColor}" !== "") {
            document.getElementById("current-propaganda-parent-div").style.backgroundColor = "${nextSchedule.backgroundColor}";
          }
        },
          ${nextSchedule.timeout});`
      )
      .join('\n\n');
    const head: HTMLHeadElement = this.document.getElementsByTagName('head')[0];
    const js: HTMLScriptElement = this.document.createElement('script');
    js.type = 'text/javascript';
    js.appendChild(this.document.createTextNode(content));
    head.appendChild(js);
  }

  private updatePropagandaOnDisplay(scheduleData: NextSchedule) {
    this.messageService.addMessage(
      `Replacing image with ${scheduleData.title}`
    );
    this.imageSource = scheduleData.data;
    if (scheduleData.backgroundColor && scheduleData.backgroundColor !== '') {
      this.backgroundColor = scheduleData.backgroundColor;
    }
  }
}
