import { Routes } from '@angular/router';
import {CampaignListComponent} from "./campaigns/components/campaign-list/campaign-list.component";

export const routes: Routes = [
  {
    path: 'campaigns',
    component: CampaignListComponent
  }
];
