import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormsModule,
} from '@angular/forms';
import {
  Observable,
  of,
  delay,
  BehaviorSubject,
  takeUntil,
  Subject,
  tap,
} from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface FieldConfig {
  maxLength: number;
  minLength: number;
  validators: any[]; // You might want a more specific type for validators
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  myForm!: FormGroup;
  field1Config$!: BehaviorSubject<FieldConfig | null>;
  field2Config$!: BehaviorSubject<FieldConfig | null>;
  private destroy$ = new Subject<void>();
  viewInitialized = false;

  field1IsFocused = false;
  field2IsFocused = false;

  constructor(private fb: FormBuilder) {
    this.field1Config$ = new BehaviorSubject<FieldConfig | null>(null);
    this.field2Config$ = new BehaviorSubject<FieldConfig | null>(null);
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({});

    console.log('View init');
    this.getFieldConfigAsync('field1')
      .pipe(
        takeUntil(this.destroy$),
        tap((_) => (this.viewInitialized = true))
      )
      .subscribe((config) => {
        // Use takeUntil
        this.field1Config$.next(config);
        this.myForm.addControl(
          'field1',
          this.fb.control('', config.validators)
        );
      });

    this.getFieldConfigAsync('field2')
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        this.field2Config$.next(config);
        this.myForm.addControl(
          'field2',
          this.fb.control('', config.validators)
        );
      });
  }

  private getFieldConfigAsync(fieldName: string): Observable<FieldConfig> {
    return of(this.simulateBackendData(fieldName)).pipe(delay(1000)); // 500ms delay
  }

  private simulateBackendData(fieldName: string): FieldConfig {
    if (fieldName === 'field1') {
      return {
        maxLength: 10,
        minLength: 1,
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(6),
          Validators.pattern(/^[0-9]{2}[A-Z]$/),
        ], // Example validators
      };
    } else if (fieldName === 'field2') {
      return {
        maxLength: 10,
        minLength: 1,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(7),
          Validators.pattern(/^[0-9]{2}[A-Z]$/),
        ], // Example validators
      };
    } else {
      return {
        maxLength: 8,
        minLength: 2,
        validators: [],
      };
    }
  }

  onSubmit() {
    if (this.myForm.valid) {
      console.log('Form submitted:', this.myForm.value);
      // Handle form submission (e.g., send data to server)
    }
  }

  ngOnDestroy(): void {
    // Implement OnDestroy
    this.destroy$.next();
    this.destroy$.complete();
  }
}
