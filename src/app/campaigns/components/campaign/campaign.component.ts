import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Campaign} from "../../types/types";
import {CurrencyPipe, NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-campaign',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    CurrencyPipe
  ],
  templateUrl: './campaign.component.html',
  styleUrl: './campaign.component.css'
})
export class CampaignComponent {
  @Input({ required: true }) campaign!: Campaign;
  @Output() onEdit = new EventEmitter<Campaign>();
  @Output() onDelete = new EventEmitter<Campaign>();
}
