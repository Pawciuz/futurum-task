import {Component, EventEmitter, Output} from '@angular/core';
import {CampaignFormComponent} from "../campaign-form/campaign-form.component";
import {Campaign} from "../../types/types";
import {CampaignsService} from "../../services/campaigns.service";

@Component({
  selector: 'app-add-campaign',
  standalone: true,
  imports: [
    CampaignFormComponent
  ],
  templateUrl: './add-campaign.component.html',
  styleUrl: './add-campaign.component.css'
})
export class AddCampaignComponent {
  @Output() closeModal = new EventEmitter<void>();
  constructor(private campaignService: CampaignsService) {}

  onSubmit(campaignData: Campaign) {
    const result = this.campaignService.addCampaign(campaignData);
    if (result) {
      this.onCancel();
    }
  }

  onCancel() {
    this.closeModal.emit();
  }
}
