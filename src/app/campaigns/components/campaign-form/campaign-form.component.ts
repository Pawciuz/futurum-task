import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Campaign} from "../../types/types";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, CurrencyPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {CampaignsService} from "../../services/campaigns.service";
import {combineLatest, map, Observable, startWith, switchAll} from "rxjs";
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
    InputComponent,
    CurrencyPipe
  ],
  templateUrl: './campaign-form.component.html',
  styleUrl: './campaign-form.component.css'
})
export class CampaignFormComponent implements OnInit{
  @Input() campaign?: Campaign;
  @Output() submit = new EventEmitter<Campaign>();
  @Output() cancel = new EventEmitter<void>();
  disabled = true;

  isTownsLoading$: Observable<boolean>;
  isKeywordsLoading$: Observable<boolean>;
  remainingFund$: Observable<number>;
  availableFundAfterCampaign$!: Observable<number>;

  readonly LoaderIcon = Loader2;

  towns: SelectOption[] = [];
  statusOptions: SelectOption[] = [
    { label: 'Active', value: 'on' },
    { label: 'Inactive', value: 'off' }
  ];
  keywords: string[] = [];
  campaignForm!: FormGroup;

  constructor(private fb: FormBuilder, private campaignsService: CampaignsService) {
    this.isTownsLoading$ = this.campaignsService.isTownsLoading$;
    this.isKeywordsLoading$ = this.campaignsService.isKeywordsLoading$;
    this.remainingFund$ = this.campaignsService.getRemainingFund();
  }

  ngOnInit() {
    this.campaignsService.getTowns()
      .pipe(
        map(towns => towns.map(town => ({ label: town, value: town })))
      )
      .subscribe(mappedTowns => {
        this.towns = mappedTowns;
      });

    this.campaignsService.getKeywords().subscribe(keywords => {
      this.keywords = keywords;
    });

    this.campaignForm = this.fb.group({
      id: [this.campaign?.id || null],
      name: [this.campaign?.name || '', [Validators.required]],
      keywords: [this.campaign?.keywords || '', Validators.required],
      bidAmount: [this.campaign?.bidAmount || 0, [Validators.required, Validators.min(0.01)]],
      campaignFund: [this.campaign?.campaignFund || 0, [Validators.required, Validators.min(0.01)]],
      status: [this.campaign?.status || 'on', Validators.required],
      town: [this.campaign?.town || '', Validators.required],
      radius: [this.campaign?.radius || 0, [Validators.required, Validators.min(1)]],
    });

    this.availableFundAfterCampaign$ = combineLatest([
      this.remainingFund$,
      this.campaignForm.get('campaignFund')!.valueChanges.pipe(startWith(this.campaignForm.get('campaignFund')!.value))
    ]).pipe(
      map(([remainingFund, campaignFund]) => remainingFund - campaignFund)
    );
  }

  onSubmit(event: SubmitEvent) {
    event.stopImmediatePropagation();
    if (this.campaignForm.valid) {
      this.submit.emit(this.campaignForm.value);
    }
  }

}
