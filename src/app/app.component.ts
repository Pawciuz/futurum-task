import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CampaignListComponent} from "./campaigns/components/campaign-list/campaign-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CampaignListComponent, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'futurum-task';
}
