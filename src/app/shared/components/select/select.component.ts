import {Component, ElementRef, forwardRef, HostListener, Input, SimpleChanges} from '@angular/core';
import {Check, ChevronDown, LucideAngularModule} from "lucide-angular";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";

interface SelectOption {
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
export class SelectComponent {
  @Input() options: string[] = [];
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
  selectedItem: string | null = null;
  filteredOptions: string[] = [];
  disabled = false;

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
    if (changes['options']) {
      this.filteredOptions = [...this.options];
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
        option.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredOptions = [...this.options];
    }
  }

  selectOption(option: string) {
    if (this.isLoading) return;

    this.selectedItem = option;
    this.isOpen = false;
    this.onChange(option);
    this.onTouched();
  }

  writeValue(value: string): void {
    this.selectedItem = value;
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
