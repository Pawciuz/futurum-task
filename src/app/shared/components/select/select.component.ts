import {Component, ElementRef, forwardRef, HostListener, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Check, ChevronDown, LucideAngularModule} from "lucide-angular";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    LucideAngularModule,
    NgForOf,
    FormsModule,
    NgIf
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
})
export class SelectComponent implements OnChanges{
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Wybierz opcję...';
  @Input() set loading(value: boolean) {
    this.isLoading = value;
    if (value) {
      this.isOpen = false;
    }
  }

  readonly ChevronDownIcon = ChevronDown;
  readonly CheckIcon = Check;

  isOpen = false;
  isLoading = false;
  searchText = '';
  selectedItem: SelectOption | null = null;
  filteredOptions: SelectOption[] = [];
  disabled = false;
  private initialValue: string | null = null;

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options'] && this.options) {
      this.filteredOptions = [...this.options];
      
      if (this.initialValue) {
        const foundOption = this.options.find(option => option.value === this.initialValue);
        if (foundOption) {
          this.selectedItem = foundOption;
        }
      }
    }
  }

  toggleDropdown() {
    if (!this.disabled && !this.isLoading) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.filteredOptions = [...this.options];
        this.searchText = '';
      }
    }
  }

  onSearch() {
    if (this.searchText) {
      this.filteredOptions = this.options.filter(option =>
        option.label.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredOptions = [...this.options];
    }
  }

  selectOption(option: SelectOption) {
    if (this.isLoading) return;

    this.selectedItem = option;
    this.isOpen = false;
    this.onChange(option.value);
    this.onTouched();
  }

  writeValue(value: string | null): void {
    this.initialValue = value;
    if (!value) {
      this.selectedItem = null;
      return;
    }

    const foundOption = this.options.find(option => option.value === value);
    if (foundOption) {
      this.selectedItem = foundOption;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
