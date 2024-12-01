import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Campaign} from "../../types/types";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {CampaignsService} from "../../services/campaigns.service";
import {Observable} from "rxjs";
import {Loader2, LucideAngularModule} from "lucide-angular";
import {ComboboxComponent} from "../../../shared/components/combobox/combobox.component";
import {SelectComponent} from "../../../shared/components/select/select.component";
import {InputComponent} from "../../../shared/components/input/input.component";

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-campaign-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    NgClass,
    AsyncPipe,
    LucideAngularModule,
    ComboboxComponent,
    SelectComponent,
    InputComponent
  ],
  templateUrl: './campaign-form.component.html',
  styleUrl: './campaign-form.component.css'
})
export class CampaignFormComponent implements OnInit{
  @Input() campaign?: Campaign;
  @Output() submit = new EventEmitter<Campaign>();
  @Output() cancel = new EventEmitter<void>();

  isTownsLoading$: Observable<boolean>;
  isKeywordsLoading$: Observable<boolean>;

  readonly LoaderIcon = Loader2;

  towns: string[] = [];
  keywords: string[] = [];
  statusOptions: SelectOption[] = [
    {label: 'Aktywny', value: 'on'},
    {label: 'Nieaktywny', value: 'off'}
  ];
  campaignForm!: FormGroup;

  get townOptions() {
    return this.transformTowns(this.towns);
  }

  constructor(private fb: FormBuilder,private campaignsService: CampaignsService) {
    this.isTownsLoading$ = this.campaignsService.isTownsLoading$;
    this.isKeywordsLoading$ = this.campaignsService.isKeywordsLoading$;
  }

  ngOnInit() {

    this.campaignsService.getTowns().subscribe(
      towns => {
        this.towns = towns;
      }
    );

    this.campaignsService.getKeywords().subscribe(
      keywords => {
        this.keywords = keywords;
      }
    );
    this.campaignForm = this.fb.group({
      id: [this.campaign?.id || ''],
      name: [this.campaign?.name || '', [Validators.required]],
      keywords: [this.campaign?.keywords || '', Validators.required],
      bidAmount: [this.campaign?.bidAmount || 0, [Validators.required, Validators.min(0.01)]],
      campaignFund: [this.campaign?.campaignFund || 0, [Validators.required, Validators.min(0.01)]],
      status: [this.campaign?.status || "on", Validators.required],
      town: [this.campaign?.town || '', Validators.required],
      radius: [this.campaign?.radius || 0, [Validators.required, Validators.min(1)]],
    });
    console.log(this.campaignForm.untouched);
  }
  transformTowns(towns: string[]): SelectOption[] {
    return towns.map(town => ({
      label: town,
      value: town
    }));
  }

  onSubmit(event:SubmitEvent) {
    event.stopImmediatePropagation();
    if (this.campaignForm.valid) {
      this.submit.emit(this.campaignForm.value);
    }
  }
}
