import { Component } from '@angular/core';

@Component({
  selector: 'app-propaganda-viewer',
  templateUrl: './propaganda-viewer.component.html',
  styleUrls: ['./propaganda-viewer.component.css'],
})
export class PropagandaViewerComponent {
  imageSource = '';
  apiDataList = [
    {
      title: 'Sprite',
      type: 'IMG_SOURCE',
      data: 'https://www.msureporter.com/wp-content/uploads/2017/04/SpriteWEB.jpg',
      scheduledTime: '2022-11-29T16:58:00.000Z',
    },
    {
      title: 'Coca Cola',
      type: 'IMG_SOURCE',
      data: 'http://cdn.differencebetween.net/wp-content/uploads/2019/03/Difference-Between-Advertisement-and-Propaganda--768x529.jpg',
      scheduledTime: '2022-11-29T16:58:10.000Z',
    },
    {
      title: '7UP',
      type: 'IMG_SOURCE',
      data: 'https://grist.org/wp-content/uploads/2010/07/ad_7up175baby_463x310.jpg',
      scheduledTime: '2022-11-29T16:58:20.000Z',
    },
  ];

  constructor() {
    // @TODO change it after API response
    setTimeout(() => {
      this.scheduleChangesBasedOnAPI();
    }, 3000);
  }

  setImageSource(imageSource: string) {
    console.log(`Replacing image with ${imageSource}`);
    this.imageSource = imageSource;
  }

  /**
   * Based on items from API, schedule the presentation of propaganda images
   * @returns void
   */
  scheduleChangesBasedOnAPI() {
    if (this.apiDataList.length === 0) {
      console.log('Nothing on the schedule');
      return;
    }
    const currentTimestamp = new Date().getTime();

    this.apiDataList.map((currentValue) => {
      const targetTimestamp = new Date(currentValue.scheduledTime).getTime();
      const timeout: number = targetTimestamp - currentTimestamp;

      console.log(
        `Scheduling for: ${currentValue.scheduledTime} == within ${Math.round(
          timeout / 1000 / 60
        )} minutes == image: ${currentValue.title}`
      );
      setTimeout(() => {
        this.setImageSource(currentValue.data);
      }, timeout);
    });
  }
}
