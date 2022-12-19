import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { CurrentSchedule } from '../interfaces/current-schedule';
import { ApiClientService } from '../services/api/api-client.service';
import { MessageService } from '../services/message.service';
import { NextSchedule } from '../interfaces/next-schedule';

@Component({
  templateUrl: './propaganda-viewer.component.html',
  styleUrls: ['./propaganda-viewer.component.css'],
})
export class PropagandaViewerComponent implements OnInit, OnDestroy {
  private injectScriptType = `text/javascript`;
  private nextSchedules: NextSchedule[] = [];
  public imageSource = '';
  public backgroundColor = '';

  // 86400 seconds in a day
  private msInSevenDays = 86400 * 1000 * 7;

  private apiClientServiceSubscription!: Subscription;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private apiClientService: ApiClientService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.apiClientServiceSubscription = this.apiClientService
      .getCurrentSchedules()
      .subscribe((res: CurrentSchedule[]) => {
        this.scheduleChangesBasedOnAPI(res);
      });
  }

  ngOnDestroy(): void {
    this.apiClientServiceSubscription.unsubscribe();
  }

  /**
   * Based on API data, schedule the images transations
   * @param apiDataList data from API
   * @returns void
   */
  private scheduleChangesBasedOnAPI(apiDataList: CurrentSchedule[]): void {
    if (apiDataList.length === 0) {
      this.setDefaultPlaceholderBackgroundImage();
      this.messageService.addMessage(`Nothing on current or future schedule`);
      return;
    }
    const currentTimestamp: number = new Date().getTime();

    apiDataList.map((scheduleData: CurrentSchedule) => {
      const targetTimestamp: number = new Date(
        scheduleData.scheduledAt
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

    if (this.imageSource === '') {
      this.setDefaultPlaceholderBackgroundImage();
    }
  }

  /**
   * Used to show a placeholder image when there is nothing on schedule to show
   * @returns void
   */
  private setDefaultPlaceholderBackgroundImage(): void {
    this.imageSource = '/assets/images/placeholder.jpg';
    this.backgroundColor = '#000000';
  }

  /**
   * Calculate timeout and create a list of schedules
   * @param scheduleData one item from list of items from API
   * @param timeout calculated timeout based on current datetime ans scheduled datetime
   * @returns void
   */
  private defineNextItems(
    scheduleData: CurrentSchedule,
    timeout: number
  ): void {
    if (timeout <= 0) {
      this.messageService.addMessage(
        `Replacing image with ${scheduleData.title}`
      );
      this.imageSource = scheduleData.data;
      if (scheduleData.backgroundColor && scheduleData.backgroundColor !== '') {
        this.backgroundColor = scheduleData.backgroundColor;
      }
      return;
    }

    const minutes: number = Math.round(timeout / 1000 / 60);
    this.messageService.addMessage(
      `Scheduling at ${scheduleData.scheduledAt}, within ${minutes} minutes` +
        `, category ${scheduleData.category}, image ${scheduleData.title}`
    );

    this.nextSchedules.push({
      data: scheduleData.data,
      title: scheduleData.title,
      category: scheduleData.category,
      backgroundColor: scheduleData.backgroundColor || '',
      timeout,
    });
  }

  /**
   * Schedule next items for replacing background images
   * It is required to manipulate document for running on old TVs browsers,
   * in addition to Server-Side Rendering
   * https://stackoverflow.com/questions/38088996/adding-script-tags-in-angular-component-template
   * @returns void
   */
  private scheduleNextItems(): void {
    if (this.nextSchedules.length === 0) {
      this.messageService.addMessage(`Nothing on future schedule`);
      return;
    }

    this.messageService.addMessage(`Setting timeouts by script injection`);

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
    js.type = this.injectScriptType;
    js.appendChild(this.document.createTextNode(content));
    head.appendChild(js);
  }
}
