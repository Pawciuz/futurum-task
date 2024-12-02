import {Component, ElementRef, forwardRef, HostListener, Input, SimpleChanges} from '@angular/core';
import {Check, ChevronDown, Loader2, LucideAngularModule, X} from "lucide-angular";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-combobox',
  standalone: true,
  imports: [
    LucideAngularModule,
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './combobox.component.html',
  styleUrl: './combobox.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxComponent),
      multi: true
    }
  ],
})
export class ComboboxComponent {
  @Input() options: string[] = [];
  @Input() placeholder = 'Choose option...';
  @Input() set loading(value: boolean) {
    this.isLoading = value;
    if (value) {
      this.isOpen = false;
    }
  }

  readonly XIcon = X;
  readonly ChevronDownIcon = ChevronDown;
  readonly CheckIcon = Check;

  isOpen = false;
  isLoading = false;
  searchText = '';
  selectedItems: string[] = [];
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

  toggleSelection(option: string) {
    if (this.isLoading) return;

    const index = this.selectedItems.indexOf(option);
    if (index === -1) {
      this.selectedItems.push(option);
    } else {
      this.selectedItems.splice(index, 1);
    }
    this.onChange(this.selectedItems);
    this.onTouched();
  }

  removeItem(item: string, event: MouseEvent) {
    if (this.isLoading) return;

    event.stopPropagation();
    const index = this.selectedItems.indexOf(item);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
      this.onChange(this.selectedItems);
      this.onTouched();
    }
  }

  isSelected(option: string): boolean {
    return this.selectedItems.includes(option);
  }

  writeValue(value: string[]): void {
    this.selectedItems = value || [];
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
