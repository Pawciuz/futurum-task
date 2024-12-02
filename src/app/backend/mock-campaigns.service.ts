import {Injectable, signal, computed, Signal} from '@angular/core';
import { delay, map, Observable, of, tap } from 'rxjs';
import { Campaign, CampaignData } from "../campaigns/types/types";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MockCampaignsService {
  private campaignsSignal = signal<Campaign[]>([]);
  private loadingSignal = signal<boolean>(false);
  private townsSignal = signal<string[]>([]);
  private keywordsSignal = signal<string[]>([]);
  private campaignFundSignal = signal<number>(0);


  constructor(private http: HttpClient) {}

  getCampaigns(): Observable<Campaign[]> {
    this.loadingSignal.set(true);

    if(this.campaignsSignal().length > 0) {
      this.loadingSignal.set(false);
      return of(this.campaignsSignal());
    }
    return this.http.get<CampaignData>('assets/mock-data/campaigns.json').pipe(
      delay(1000),
      tap(data => {
        this.campaignsSignal.set(data.campaigns);
        this.loadingSignal.set(false);
      }),
      map(data => data.campaigns)
    );
  }

  addCampaign(campaign: Campaign): Observable<Campaign> {
    this.loadingSignal.set(true);
    const newCampaign = {
      ...campaign,
      id: this.generateUniqueId()
    };

    return of(newCampaign).pipe(
      delay(1000),
      tap(campaign => {
        this.campaignsSignal.update(campaigns => [...campaigns, campaign]);
        this.loadingSignal.set(false);
      })
    );
  }

  updateCampaign(campaign: Campaign): Observable<Campaign> {
    this.loadingSignal.set(true);
    return of(campaign).pipe(
      delay(1000),
      tap(updatedCampaign => {
        this.campaignsSignal.update(campaigns =>
          campaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c)
        );
        this.loadingSignal.set(false);
      })
    );
  }

  deleteCampaign(id: number): Observable<number> {
    this.loadingSignal.set(true);

    return of(id).pipe(
      delay(1000),
      tap(() => {
        this.campaignsSignal.update(campaigns =>
          campaigns.filter(c => c.id !== id)
        );
        this.loadingSignal.set(false);
      })
    );
  }

  getTowns(): Observable<string[]> {
    return this.http.get<CampaignData>('assets/mock-data/towns.json').pipe(
      delay(1000),
      tap(data => {
        this.townsSignal.set(data.towns);
      }),
      map(data => data.towns)
    );
  }

  getKeywords(): Observable<string[]> {
    return this.http.get<CampaignData>('assets/mock-data/keywords.json').pipe(
      delay(1000),
      tap(data => {
        this.keywordsSignal.set(data.keywords);
      }),
      map(data => data.keywords)
    );
  }
  getCampaignFund(): Observable<number> {
    return of(10000);
  }
  getRemainingFund(): Observable<number> {
    return this.campaignsSignal().length > 0
      ? of(10000 - this.campaignsSignal().map(c => c.campaignFund).reduce((a, b) => a + b))
      : of(10000);
  }
  private generateUniqueId(): number {
    const campaigns = this.campaignsSignal();
    return campaigns.length > 0
      ? Math.max(...campaigns.map(c => c.id || 0)) + 1
      : 1;
  }
}
