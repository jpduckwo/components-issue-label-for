import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
  UntypedFormControl,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject, takeUntil, tap } from 'rxjs';
import { MatInputBaseWithErrorState } from './error-state-mixin';

@Component({
  selector: 'app-custom-control',
  standalone: true,
  imports: [CommonModule],
  providers: [
    { provide: MatFormFieldControl, useExisting: CustomControlComponent },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>test</div>
  `,
})
export class CustomControlComponent
  extends MatInputBaseWithErrorState
  implements
    ControlValueAccessor,
    MatFormFieldControl<number>,
    OnInit,
    OnDestroy,
    DoCheck
{
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static ngAcceptInputType_disabled: boolean | string | null | undefined;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static ngAcceptInputType_required: boolean | string | null | undefined;
  static nextId = 0;

  @ViewChild('dateInput', { static: false })
  dateInput: ElementRef<HTMLInputElement>;

  @Input()
  showHeader = false;

  @Output()
  selectedValue = new EventEmitter<string>();

  @HostBinding('id')
  id = `app-custom-control-${CustomControlComponent.nextId++}`;

  @HostBinding('attr.aria-describedby')
  describedBy = '';

  @HostBinding('class.app-custom-control-floating')
  get shouldLabelFloat() {
    return true;
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {}

  @Input()
  get value(): number | null {
    return this._value;
  }
  set value(value: number | null) {
    this._value = value;
    this.onChange(this.value);
    this.onTouched();
    this.stateChanges.next();
  }

  controlType = 'app-custom-control';
  override stateChanges = new Subject<void>();
  focused = false;
  ctrl = new UntypedFormControl();
  private _placeholder: string;
  private _value: number | null = null;
  private _required = false;
  private _disabled = false;
  private _ngUnsubscribe$ = new Subject<void>();

  constructor(
    public override _defaultErrorStateMatcher: ErrorStateMatcher,
    public override _elementRef: ElementRef<HTMLElement>,
    @Optional() public override _parentForm: NgForm,
    @Optional() public override _parentFormGroup: FormGroupDirective,
    @Optional() @Self() public override ngControl: NgControl,
    private _focusMonitor: FocusMonitor,
    private _changes: ChangeDetectorRef
  ) {
    super(
      _elementRef,
      _defaultErrorStateMatcher,
      _parentForm,
      _parentFormGroup,
      ngControl
    );
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (_: any) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  get empty() {
    return this.value == null;
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    this.dateInput.nativeElement.focus();
  }

  writeValue(val: number | null): void {
    this.value = val;
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

  selectionChange(value: string) {
    this.selectedValue.emit(value);
  }

  /**
   * End implements properties and methods
   */

  ngOnInit() {
    this._focusMonitor
      .monitor(this._elementRef, true)
      .pipe(
        tap((origin) => {
          // Trigger onTouched if was focused and now isn't
          if (this.focused && !origin) {
            this.onTouched();
            this.stateChanges.next();
          }
          // Track if focused on any element or child element
          this.focused = !!origin;
        }),
        takeUntil(this._ngUnsubscribe$)
      )
      .subscribe();
  }

  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
    }
  }

  ngOnDestroy() {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }
}
