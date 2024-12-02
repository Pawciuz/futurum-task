import {Component, computed, effect, OnInit, signal} from '@angular/core';
import {Campaign} from "../../types/types";
import {CampaignsService} from "../../services/campaigns.service";
import {AsyncPipe, CurrencyPipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {ModalComponent} from "../../../shared/components/modal/modal.component";
import {FormsModule} from "@angular/forms";
import {CampaignComponent} from "../campaign/campaign.component";
import {CampaignFormComponent} from "../campaign-form/campaign-form.component";
import { Observable} from "rxjs";
import {Loader2, LucideAngularModule} from "lucide-angular";

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
    NgSwitch,
    NgSwitchCase,
    LucideAngularModule,
    NgClass,
    CurrencyPipe
  ],
  templateUrl: './campaign-list.component.html',
  styleUrl: './campaign-list.component.css'
})
export class CampaignListComponent implements OnInit {
  readonly LoaderIcon = Loader2;

  private campaignsSignal = signal<Campaign[]>([]);
  private totalFundSignal = signal<number>(0);
  readonly remainingFund = computed(() => {
    const totalFund = this.totalFundSignal();
    const usedFund = this.campaignsSignal().reduce(
      (sum, campaign) => sum + (campaign.campaignFund || 0),
      0
    );
    return totalFund - usedFund;
  });

  readonly campaigns = computed(() => this.campaignsSignal());
  readonly totalFund = computed(() => this.totalFundSignal());
  readonly usedFund = computed(() =>
    this.totalFundSignal() - this.remainingFund()
  );
  isLoading$!: Observable<boolean>;
  showModal = signal(false);
  modalContent = signal<'edit' | 'add' | 'confirmDelete' | null>(null);
  selectedCampaign = signal<Campaign | null>(null);

  constructor(private campaignService: CampaignsService) {
  }

  ngOnInit(): void {
    this.isLoading$ = this.campaignService.isCampaignsLoading$;

    this.loadInitialData();
  }

  private loadInitialData() {
    this.campaignService.loadCampaigns().subscribe(campaigns => {
      this.campaignsSignal.set(campaigns);
    });

    this.campaignService.getCampaignFund().subscribe(fund => {
      this.totalFundSignal.set(fund);
    });
  }

  openAddModal(): void {
    this.selectedCampaign.set(null);
    this.modalContent.set('add');
    this.showModal.set(true);
  }

  openEditModal(campaign: Campaign) {
    this.selectedCampaign.set(campaign);
    this.modalContent.set('edit');
    this.showModal.set(true);
  }

  addCampaign(campaignData: Campaign) {
    if (this.remainingFund() >= campaignData.campaignFund) {
      const result = this.campaignService.addCampaign(campaignData);
      if (result) {
        result.subscribe(campaign => {
          this.campaignsSignal.update(campaigns => [...campaigns, campaign]);
        });
        this.closeModal();
      }
    } else {
      alert('Insufficient funds for this campaign!');
    }
  }

  updateCampaign(campaignData: Campaign) {
    const currentCampaign = this.campaignsSignal().find(c => c.id === campaignData.id);
    const fundDifference = (campaignData.campaignFund || 0) - (currentCampaign?.campaignFund || 0);

    if (this.remainingFund() >= fundDifference) {
      const result = this.campaignService.updateCampaign(campaignData);
      if (result) {
        result.subscribe(campaign => {
          this.campaignsSignal.update(campaigns =>
            campaigns.map(c => c.id === campaign.id ? campaign : c)
          );
        });
        this.closeModal();
      }
    } else {
      alert('Insufficient funds for this update!');
    }
  }

  openDeleteConfirmation(campaign: Campaign) {
    this.selectedCampaign.set(campaign);
    this.modalContent.set('confirmDelete');
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedCampaign.set(null);
    this.modalContent.set(null);
  }

  onDeleteCampaign() {
    if (this.selectedCampaign()?.id) {
      this.campaignService.deleteCampaign(this.selectedCampaign()!.id!).subscribe(() => {
        this.campaignsSignal.update(campaigns =>
          campaigns.filter(c => c.id !== this.selectedCampaign()?.id)
        );
        this.closeModal();
      });
    }
  }

  getModalTitle(): string {
    switch (this.modalContent()) {
      case 'add': return 'Add campaign';
      case 'edit': return 'Edit campaign';
      case 'confirmDelete': return 'Delete campaign';
      default: return '';
    }
  }
}
