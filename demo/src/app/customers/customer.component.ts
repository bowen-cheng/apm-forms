import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

import { Customer } from './customer';
import { Functions } from './functions';


////////////////////////////////////////
// Component class
////////////////////////////////////////

@Component({
  selector: 'my-signup',
  templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
  // Form model
  customerForm: FormGroup;
  // Data model
  customer: Customer = new Customer();
  emailErrorMsg: string;

  private validationMessage = {
    // Note the keys of this object matches the names of HTML validation rules
    required: 'Please enter your email address',
    pattern: 'Please enter a valid email address'
  };

  constructor(private fb: FormBuilder) {
  }

  get addressArray(): FormArray {
    return <FormArray>this.customerForm.get('addressArray');
  }

  ngOnInit(): void {
    // Creating the form model with form group
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
        confirmEmail: ['', Validators.required]
        // Note the following validator function is added to the group, not to the individual formControls
      }, { validator: Functions.emailMatcher }),
      phone: '',
      notification: 'email',
      rating: ['', Functions.ratingRangeWithParams(1, 5)],
      sendCatalog: true,

      // Address group is at position 0 of this FormArray
      // There can be more FormGroups and FormControls in the array, whose position starts from 1
      addressArray: this.fb.array([this.buildAddressGroup()])
    });

    // Watches the value changes of notification formControl
    this.customerForm.get('notification').valueChanges.subscribe(value => this.setNotification(value));

    // Watches the value changes of 'email' formControl
    const emailControl = this.customerForm.get('emailGroup.email');
    // The debounceTime operator waits for 1 sec of no events before emitting another event
    emailControl.valueChanges.debounceTime(1000).subscribe(() => this.setErrMessage(emailControl));
  }

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm));
  }

  /**
   * Demonstrate how to update validators during runtime as per user inputs
   * @param notifyBy
   */
  setNotification(notifyBy: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyBy === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  /**
   * Update the error message of 'email' formControl if applicable
   */
  setErrMessage(control: AbstractControl): void {
    // Reset error messages first in case there is no error on new user inputs
    this.emailErrorMsg = '';
    if ((control.touched || control.dirty) && control.errors) {
      // Show different error messages depending on different errors
      this.emailErrorMsg = Object.keys(control.errors).map(key => this.validationMessage[key]).join(' ');
    }
  }

  addAddress(): void {
    this.addressArray.push(this.buildAddressGroup());
  }

  buildAddressGroup(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: ''
    });
  }

////////////////////////////////////////
// Unused functions below
////////////////////////////////////////
  /**
   * Demonstrate the usage of setValue (Outdated, does not contain all FormControls in the FormGroup)
   * setValue function must set all values in the FormGroup
   */
  populateAll(): void {
    // attribute names of the object passed into setValue must match the names of the formControl
    this.customerForm.setValue({
      firstName: 'Jack',
      lastName: 'Ma',
      email: 'Jack.Ma@alibaba.com',
      sendCatalog: false
    });
  }

  /**
   * Demonstrate the usage of patchValue
   * patchValue function allows to set only a subset of values in the FormGroup
   */
  populateEmail(): void {
    // attribute names of the object passed into setValue must match the names of the formControl
    this.customerForm.patchValue({
      email: 'me@example.com'
    });
  }
}
