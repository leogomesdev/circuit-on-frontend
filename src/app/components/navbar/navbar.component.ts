import { Component } from '@angular/core';
import { AppPropertiesService } from 'src/app/services/app-properties.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(
    public nav: NavbarService,
    public app: AppPropertiesService,
    public loginService: LoginService
  ) {}
}
