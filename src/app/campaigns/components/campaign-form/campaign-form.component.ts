import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Campaign} from "../../types/types";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {CampaignsService} from "../../services/campaigns.service";

@Component({
  selector: 'app-campaign-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    NgClass
  ],
  templateUrl: './campaign-form.component.html',
  styleUrl: './campaign-form.component.css'
})
export class CampaignFormComponent implements OnInit{
  @Input() campaign?: Campaign;
  @Output() submit = new EventEmitter<Campaign>();
  @Output() cancel = new EventEmitter<void>();
  towns: string[] = [];
  keywords: string[] = [];

  campaignForm!: FormGroup;

  constructor(private fb: FormBuilder,private campaignsService: CampaignsService) {

  }

  ngOnInit() {
    this.campaignsService.getTowns().subscribe(towns => {
      this.towns = towns;
    });

    this.campaignsService.getKeywords().subscribe(keywords => {
      this.keywords = keywords;
    });
    this.campaignForm = this.fb.group({
      id: [this.campaign?.id || ''],
      name: [this.campaign?.name || '', [Validators.required]],
      keywords: [this.campaign?.keywords || '', Validators.required],
      bidAmount: [this.campaign?.bidAmount || 0, [Validators.required, Validators.min(0.01)]],
      campaignFund: [this.campaign?.campaignFund || 0, [Validators.required, Validators.min(0.01)]],
      status: ['on', Validators.required],
      town: [this.campaign?.town || '', Validators.required],
      radius: [this.campaign?.radius || 0, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(event:SubmitEvent) {
    event.stopImmediatePropagation();
    if (this.campaignForm.valid) {
      this.submit.emit(this.campaignForm.value);
    }
  }
}
