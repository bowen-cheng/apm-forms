import { AbstractControl, ValidatorFn } from '@angular/forms';

export class Functions {

////////////////////////////////////////
// Validator functions (Cross field)
////////////////////////////////////////

  static emailMatcher(control: AbstractControl): { [key: string]: boolean } | null {
    // Get the form controls by their formControlName
    const emailControl = control.get('email');
    const confirmControl = control.get('confirmEmail');
    if (emailControl.pristine || confirmControl.pristine) {
      return null;
    }
    if (emailControl.value === confirmControl.value) {
      return null;
    } else {
      // key ('match') is the validation rule
      // this adds the validation error to the *formGroup*, NOT the individual formControl
      // Because the validator function is added to the group, not to the individual formControls
      return { 'match': true };
    }
  }

////////////////////////////////////////
// Validator functions (single field)
////////////////////////////////////////

  /**
   * Custom validator function:
   * The parameter is either a formControl or a formGroup
   * If validation succeeds without error, the function returns null
   * Otherwise, the function returns a set of key-value pairs,
   * string defines the broken validation rule, value "true" means error exists
   */
  static ratingRange(control: AbstractControl): { [key: string]: boolean } | null {
    const input = control.value;
    if (input !== undefined && (isNaN(input) || input < 1 || input > 5)) {
      // the returned rule name matches the one defined in the HTML (range)
      return { 'range': true };
    } else {
      return null;
    }
  }

  /**
   * If we want to use the validator function with parameters, it needs to be wrapped within a factory function which
   * returns it.
   */
  static ratingRangeWithParams(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const input = control.value;
      if (input !== undefined && (isNaN(input) || input < min || input > max)) {
        // the returned rule name matches the one defined in the HTML (range)
        return { 'range': true };
      } else {
        return null;
      }
    };
  }
}
