import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { DatePipe, DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { AppPropertiesService } from 'src/app/services/app-properties.service';
import { CurrentSchedule } from 'src/app/interfaces/api-responses/current-schedules/current-schedule.interface';
import { CurrentSchedulesApiService } from 'src/app/services/api/current-schedules-api.service';
import { environment } from 'src/environments/environment';
import { MessageService } from 'src/app/services/message.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { NextSchedule } from 'src/app/interfaces/next-schedule.interface';

@Component({
  templateUrl: './current-schedule-viewer.component.html',
  styleUrls: ['./current-schedule-viewer.component.css'],
})
export class CurrentScheduleViewerComponent implements OnInit, OnDestroy {
  private injectScriptType = `text/javascript`;
  private nextSchedules: NextSchedule[] = [];
  // 86400 seconds in a day
  private msInSevenDays = 86400 * 1000 * 7;
  private currentSchedulesApiServiceSubscription!: Subscription;

  maxFutureItems = Number(environment.envVar.NG_APP_VIEW_PAGE_FUTURE_ITEMS);
  imageSource = '';
  backgroundColor = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private CurrentSchedulesApiService: CurrentSchedulesApiService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private nav: NavbarService,
    private app: AppPropertiesService
  ) {}

  ngOnInit(): void {
    this.nav.hide();
    this.currentSchedulesApiServiceSubscription =
      this.CurrentSchedulesApiService.getAll(this.maxFutureItems).subscribe(
        (res: CurrentSchedule[]) => {
          this.scheduleChangesBasedOnAPI(res);
        }
      );
  }

  ngOnDestroy(): void {
    this.nav.show();
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
      this.app.SHORT_DATETIME_FORMAT
    );
    this.messageService.addMessage(
      `At ${formattedDate}: ${scheduleData.category.toUpperCase()}: ${
        scheduleData.title
      }`
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
          document.getElementById("current-image-img").src = "${nextSchedule.data}";
          if("${nextSchedule.backgroundColor}" !== "") {
            document.getElementById("current-image-parent-div").style.backgroundColor = "${nextSchedule.backgroundColor}";
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
