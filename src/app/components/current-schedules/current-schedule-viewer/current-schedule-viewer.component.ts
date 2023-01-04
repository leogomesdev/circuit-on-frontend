import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { DatePipe, DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { CurrentSchedule } from '../../../interfaces/current-schedule';
import { CurrentSchedulesApiService } from '../../../services/api/current-schedules-api.service';
import { MessageService } from '../../../services/message.service';
import { NextSchedule } from '../../../interfaces/next-schedule';

@Component({
  templateUrl: './current-schedule-viewer.component.html',
  styleUrls: ['./current-schedule-viewer.component.css'],
})
export class CurrentScheduleViewerComponent implements OnInit, OnDestroy {
  private injectScriptType = `text/javascript`;
  private nextSchedules: NextSchedule[] = [];
  private SHORT_DATETIME_FORMAT = 'EEE, MMM d HH:mm';
  // 86400 seconds in a day
  private msInSevenDays = 86400 * 1000 * 7;
  private currentSchedulesApiServiceSubscription!: Subscription;

  public imageSource = '';
  public backgroundColor = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private CurrentSchedulesApiService: CurrentSchedulesApiService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.currentSchedulesApiServiceSubscription =
      this.CurrentSchedulesApiService.getCurrentSchedules().subscribe(
        (res: CurrentSchedule[]) => {
          this.scheduleChangesBasedOnAPI(res);
        }
      );
  }

  ngOnDestroy(): void {
    if (this.currentSchedulesApiServiceSubscription) {
      this.currentSchedulesApiServiceSubscription.unsubscribe();
    }
  }

  /**
   * Based on API data, schedule the images transations
   * @param apiDataList data from API
   * @returns void
   */
  private scheduleChangesBasedOnAPI(apiDataList: CurrentSchedule[]): void {
    if (apiDataList.length === 0) {
      this.setDefaultPlaceholderBackgroundImage();
      this.messageService.showSuccess(`Nothing on current or future schedule`);
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
    this.messageService.displayAllMessagesAndClear(15);
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
      this.imageSource = scheduleData.data;
      if (scheduleData.backgroundColor && scheduleData.backgroundColor !== '') {
        this.backgroundColor = scheduleData.backgroundColor;
      }
      return;
    }

    const formattedDate = this.datePipe.transform(
      scheduleData.scheduledAt,
      this.SHORT_DATETIME_FORMAT
    );
    this.messageService.addMessage(
      `At ${formattedDate}: ${scheduleData.category}: ${scheduleData.title}`
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
