import { Component, forwardRef, Input } from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule} from '@angular/forms';
import { Loader2, LucideAngularModule } from 'lucide-angular';
import { NgIf } from '@angular/common';

type InputType = 'text' | 'number';
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
  @Input() placeholder = 'Enter value...';
  @Input() label?: string;
  @Input() type: InputType = 'text';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() errorMessage?: string;

  value: string | number = '';
  private onChange = (value: any) => {};
  protected onTouched = () => {};

  readonly LoaderIcon = Loader2;

  get isLoading(): boolean {
    return this.loading;
  }

  get showError(): boolean {
    return !!this.errorMessage;
  }

  handleInput(value: any): void {
    if (this.type === 'number') {
      const numValue = value === '' ? '' : Number(value);
      this.value = numValue;
      this.onChange(numValue);
    } else {
      this.value = value;
      this.onChange(value);
    }
  }

  writeValue(value: any): void {
    this.value = value ?? '';
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
