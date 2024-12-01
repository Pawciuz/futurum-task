import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Campaign, CampaignData } from "../types/types";

@Injectable({
  providedIn: 'root'
})
export class CampaignsService {
  private campaignsSubject = new BehaviorSubject<Campaign[]>([]);

  private campaignsLoadingSubject = new BehaviorSubject<boolean>(false);
  private townsLoadingSubject = new BehaviorSubject<boolean>(false);
  private keywordsLoadingSubject = new BehaviorSubject<boolean>(false);

  public isCampaignsLoading$ = this.campaignsLoadingSubject.asObservable();
  public isTownsLoading$ = this.townsLoadingSubject.asObservable();
  public isKeywordsLoading$ = this.keywordsLoadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCampaigns();
  }

  private loadCampaigns(): void {
    this.campaignsLoadingSubject.next(true);
    this.http.get<CampaignData>('assets/mock-data/campaigns.json')
      .pipe(
        delay(1000),
        map(data => data.campaigns),
        finalize(() => this.campaignsLoadingSubject.next(false))
      )
      .subscribe(campaigns => this.campaignsSubject.next(campaigns));
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
    const updatedCampaigns = currentCampaigns.filter(c => c.id !== id);
    this.campaignsSubject.next(updatedCampaigns);
  }

  getTowns(): Observable<string[]> {
    this.townsLoadingSubject.next(true);
    return this.http.get<CampaignData>('assets/mock-data/campaigns.json').pipe(
      delay(1000),
      map(data => data.towns),
      finalize(() => this.townsLoadingSubject.next(false))
    );
  }

  getKeywords(): Observable<string[]> {
    this.keywordsLoadingSubject.next(true);
    return this.http.get<CampaignData>('assets/mock-data/campaigns.json').pipe(
      delay(3000),
      map(data => data.keywords),
      finalize(() => this.keywordsLoadingSubject.next(false))
    );
  }

  private generateUniqueId(campaigns: Campaign[]): number {
    return campaigns.length > 0
      ? Math.max(...campaigns.map(c => c.id || 0)) + 1
      : 1;
  }
}
