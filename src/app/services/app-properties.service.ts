import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppPropertiesService {
  LONG_DATETIME_FORMAT = 'EEE, MMM d, y h:mm a z';
  SHORT_DATETIME_FORMAT = 'EEE, MMM d HH:mm';
  screenWidth = 0;
  screenHeight = 0;
  dateTimeFormat = this.LONG_DATETIME_FORMAT;
  isSmallScreen = false;
  isMediumScreen = false;
  modalWidth = '60%';
  modalMaxWidth = '98vw';
  username!: string | undefined;
  isAuthenticated = false;

  /**
   * If the screen is small, this info is useful for formatting DateTime fields
   * This info is also used for other displaying visual components
   * @returns void
   */
  changePropertiesBasedOnSize(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.isSmallScreen = this.screenWidth <= 800;
    this.isMediumScreen = this.screenWidth > 800 && this.screenWidth < 1200;
    this.dateTimeFormat =
      this.isSmallScreen || this.isMediumScreen
        ? this.SHORT_DATETIME_FORMAT
        : this.LONG_DATETIME_FORMAT;
    this.modalWidth = this.isSmallScreen ? '98%' : '60%';
  }
}
