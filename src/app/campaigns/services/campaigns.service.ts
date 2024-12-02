import { Injectable } from '@angular/core';
import {BehaviorSubject, finalize, Observable, tap} from 'rxjs';
import { Campaign } from "../types/types";
import {MockCampaignsService} from "../../backend/mock-campaigns.service";

@Injectable({
  providedIn: 'root'
})
export class CampaignsService {

  public isCampaignsLoading$ = new BehaviorSubject<boolean>(false);
  public isTownsLoading$ = new BehaviorSubject<boolean>(false);
  public isKeywordsLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private mockService: MockCampaignsService) {
  }

  loadCampaigns(): Observable<Campaign[]> {
    this.isCampaignsLoading$.next(true);
    return this.mockService.getCampaigns().pipe(
      finalize(() => this.isCampaignsLoading$.next(false))
    );
  }

  addCampaign(campaign: Campaign): Observable<Campaign> {
    return this.mockService.addCampaign(campaign)
  }

  updateCampaign(campaign: Campaign): Observable<Campaign> {
    return this.mockService.updateCampaign(campaign)
  }

  deleteCampaign(id: number): Observable<number> {
    return this.mockService.deleteCampaign(id)
  }

  getTowns(): Observable<string[]> {
    this.isTownsLoading$.next(true);
    return this.mockService.getTowns().pipe(
      finalize(() => this.isTownsLoading$.next(false))
    );
  }

  getKeywords(): Observable<string[]> {
    this.isKeywordsLoading$.next(true);
    return this.mockService.getKeywords().pipe(
      finalize(() => this.isKeywordsLoading$.next(false))
    );
  }
  getCampaignFund(): Observable<number> {
    return this.mockService.getCampaignFund();
  }
  getRemainingFund(): Observable<number> {
    return this.mockService.getRemainingFund();
  }
}
