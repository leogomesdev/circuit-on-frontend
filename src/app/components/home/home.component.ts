import { Component } from '@angular/core';
import { AppPropertiesService } from 'src/app/services/app-properties.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(
    public app: AppPropertiesService,
    public loginService: LoginService
  ) {}
}
