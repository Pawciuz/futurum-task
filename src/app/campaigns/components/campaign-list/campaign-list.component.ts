import { Component } from '@angular/core';
import {Campaign} from "../../types/types";
import {CampaignsService} from "../../services/campaigns.service";
import {AsyncPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {ModalComponent} from "../../../shared/modal/modal.component";
import {FormsModule} from "@angular/forms";
import {CampaignComponent} from "../campaign/campaign.component";
import {CampaignFormComponent} from "../campaign-form/campaign-form.component";
import {Observable} from "rxjs";
import {AddCampaignComponent} from "../add-campaign/add-campaign.component";
import {EditCampaignComponent} from "../edit-campaign/edit-campaign.component";

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [
    NgForOf,
    ModalComponent,
    NgIf,
    FormsModule,
    CampaignComponent,
    CampaignFormComponent,
    AsyncPipe,
    AddCampaignComponent,
    NgSwitch,
    EditCampaignComponent,
    NgSwitchCase
  ],
  templateUrl: './campaign-list.component.html',
  styleUrl: './campaign-list.component.css'
})
export class CampaignListComponent {
  campaigns$!: Observable<Campaign[]>;
  showModal = false;
  modalContent: 'edit' | 'add' | 'confirmDelete' | null = null;
  selectedCampaign: Campaign | null = null;

  constructor(private campaignService: CampaignsService) {}

  ngOnInit() {
    this.campaigns$ = this.campaignService.getCampaigns();
  }

  openAddModal(): void {
    this.selectedCampaign = null;
    this.modalContent = 'add';
    this.showModal = true;
  }

  openEditModal(campaign: Campaign) {
    this.selectedCampaign = campaign;
    this.modalContent = 'edit';
    this.showModal = true;
  }

  openDeleteConfirmation(campaign: Campaign) {
    this.selectedCampaign = campaign;
    this.modalContent = 'confirmDelete';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedCampaign = null;
    this.modalContent = null;
  }

  deleteCampaign() {
    if (this.selectedCampaign?.id) {
      this.campaignService.deleteCampaign(this.selectedCampaign.id);
      this.closeModal();
    }
  }
}
