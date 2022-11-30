import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PropagandaViewerService } from '../services/propaganda-viewer.service';

@Component({
  selector: 'app-propaganda-viewer',
  templateUrl: './propaganda-viewer.component.html',
  styleUrls: ['./propaganda-viewer.component.css'],
})
export class PropagandaViewerComponent implements OnInit, OnDestroy {
  imageSource: string = 'assets/images/placeholder.jpg';
  backgroundColor: string = 'white';
  private propagandaViewerServiceSubscription!: Subscription;

  constructor(private propagandaViewerService: PropagandaViewerService) {}

  ngOnInit(): void {
    this.propagandaViewerServiceSubscription =
      this.propagandaViewerService.propagandaUpdated.subscribe(() => {
        this.updatePropagandaOnDisplay(
          this.propagandaViewerService.imageSource,
          this.propagandaViewerService.backgroundColor
        );
      });
    this.propagandaViewerService.scheduleChangesBasedOnAPI();
  }

  ngOnDestroy(): void {
    this.propagandaViewerServiceSubscription.unsubscribe();
  }

  updatePropagandaOnDisplay(imageSource: string, backgroundColor: string) {
    console.log(`Replacing image with ${imageSource}`);
    this.imageSource = imageSource;
    this.backgroundColor = backgroundColor;
  }
}
