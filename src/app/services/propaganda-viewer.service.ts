import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PropagandaViewerService {
  private isServer = false;
  imageSource = '';
  backgroundColor = '';
  // 86400 seconds in a day
  private msInSevenDays = 86400 * 1000 * 7;

  propagandaUpdated: Subject<string> = new Subject();

  private apiDataList = [
    {
      title: 'Sprite',
      type: 'IMG_SOURCE',
      backgroundColor: '#ff00000',
      data: 'https://www.msureporter.com/wp-content/uploads/2017/04/SpriteWEB.jpg',
      scheduledTime: '2022-12-01T19:55:00.000Z',
    },
    {
      title: 'Coca Cola',
      type: 'IMG_SOURCE',
      backgroundColor: '#00ff00',
      data: 'http://cdn.differencebetween.net/wp-content/uploads/2019/03/Difference-Between-Advertisement-and-Propaganda--768x529.jpg',
      scheduledTime: '2022-12-01T19:56:10.000Z',
    },
    {
      title: '7UP',
      type: 'IMG_SOURCE',
      data: 'https://grist.org/wp-content/uploads/2010/07/ad_7up175baby_463x310.jpg',
      scheduledTime: '2023-12-01T15:54:31.000Z',
    },
  ];

  constructor(@Inject(PLATFORM_ID) platformID: any) {
    this.isServer = isPlatformServer(platformID);
  }

  /**
   * Based on items from API, schedule the presentation of propaganda images
   * @returns void
   */
  scheduleChangesBasedOnAPI() {
    if (process?.env['STAGE'] === 'build' || this.apiDataList.length === 0) {
      console.log('Nothing on the schedule');
      return;
    }
    const currentTimestamp: number = new Date().getTime();

    this.apiDataList.map((currentValue) => {
      const targetTimestamp: number = new Date(
        currentValue.scheduledTime
      ).getTime();
      const timeout: number = targetTimestamp - currentTimestamp;
       
      if (timeout > this.msInSevenDays || timeout < (this.msInSevenDays * -1)) {
        console.log(
          `Item is scheduled for > than 7 days, skipping it to fit into 32-bit signed integer. == image: ${currentValue.title}`
        );
      } else {
        console.log(
          `Scheduling for: ${currentValue.scheduledTime} == within ${Math.round(
            timeout / 1000 / 60
          )} minutes == image: ${currentValue.title}`
        );
        setTimeout(() => {
          this.imageSource = currentValue.data;
          if (
            currentValue.backgroundColor &&
            currentValue.backgroundColor !== ''
          ) {
            this.backgroundColor = currentValue.backgroundColor;
          }
          this.propagandaUpdated.next('update');
        }, timeout);
      }
    });
  }
}
