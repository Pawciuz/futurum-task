import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {Campaign, CampaignData} from "../types/types";


@Injectable({
  providedIn: 'root'
})
export class CampaignsService {
  private campaignsSubject = new BehaviorSubject<Campaign[]>([]);

  constructor(private http: HttpClient) {
    this.loadCampaigns();
  }

  private loadCampaigns() {
    this.http.get<CampaignData>('assets/mock-data/campaigns.json')
      .pipe(
        delay(1000), // Opóźnienie w milisekundach (np. 1 sekunda)
        map(data => data.campaigns)
      )
      .subscribe(campaigns => {
        this.campaignsSubject.next(campaigns);
      });
  }

  getCampaigns(): Observable<Campaign[]> {
    return this.campaignsSubject.asObservable();
  }


  addCampaign(campaign: Campaign): boolean {
    const currentCampaigns = this.campaignsSubject.value;
    campaign.id = this.generateUniqueId(currentCampaigns);

    const updatedCampaigns = [...currentCampaigns, campaign];
    this.campaignsSubject.next(updatedCampaigns);

    return true;
  }

  updateCampaign(updatedCampaign: Campaign): boolean {
    const currentCampaigns = this.campaignsSubject.value;
    const index = currentCampaigns.findIndex(c => c.id === updatedCampaign.id);

    if (index !== -1) {
      const updatedCampaigns = [...currentCampaigns];
      updatedCampaigns[index] = updatedCampaign;
      this.campaignsSubject.next(updatedCampaigns);
      return true;
    }


    return false;
  }

  deleteCampaign(id: number): void {
    const currentCampaigns = this.campaignsSubject.value;
    const campaignToDelete = currentCampaigns.find(c => c.id === id);

    if (campaignToDelete) {

      const updatedCampaigns = currentCampaigns.filter(c => c.id !== id);
      this.campaignsSubject.next(updatedCampaigns);
    }
  }

  getTowns(): Observable<string[]> {
    return this.http.get<CampaignData>('assets/mock-data/campaigns.json')
      .pipe(
        delay(1000),
        map(data => data.towns)
      );
  }

  getKeywords(): Observable<string[]> {
    return this.http.get<CampaignData>('assets/mock-data/campaigns.json')
      .pipe(
        delay(1000), // Opóźnienie w milisekundach
        map(data => data.keywords)
      );
  }

  private generateUniqueId(campaigns: Campaign[]): number {
    return campaigns.length > 0
      ? Math.max(...campaigns.map(c => c.id || 0)) + 1
      : 1;
  }
}
