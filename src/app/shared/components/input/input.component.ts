import { Component, forwardRef, Input } from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule} from '@angular/forms';
import { Loader2, LucideAngularModule } from 'lucide-angular';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [NgIf, LucideAngularModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() placeholder = 'Wpisz wartość...';
  @Input() label?: string;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() errorMessage?: string;

  value = '';
  private onChange = (value: any) => {};
  protected onTouched = () => {};

  readonly LoaderIcon = Loader2;

  get isLoading(): boolean {
    return this.loading;
  }

  get showError(): boolean {
    return !!this.errorMessage;
  }

  onValueChange(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  writeValue(value: string): void {
    this.value = value || '';
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
