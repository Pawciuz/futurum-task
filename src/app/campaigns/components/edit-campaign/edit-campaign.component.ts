import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CampaignFormComponent} from "../campaign-form/campaign-form.component";
import {Campaign} from "../../types/types";
import {CampaignsService} from "../../services/campaigns.service";

@Component({
  selector: 'app-edit-campaign',
  standalone: true,
  imports: [
    CampaignFormComponent
  ],
  templateUrl: './edit-campaign.component.html',
  styleUrl: './edit-campaign.component.css'
})
export class EditCampaignComponent {
  @Input() campaign!: Campaign;
  @Output() closeModal = new EventEmitter<void>();

  constructor(private campaignService: CampaignsService) {}

  onSubmit(campaignData: Campaign) {
    const result = this.campaignService.updateCampaign(campaignData);
    if (result) {
      this.onCancel();
    }
  }

  onCancel() {
    this.closeModal.emit();
  }
}
