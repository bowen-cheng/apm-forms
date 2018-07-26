import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { Customer } from './customer';

////////////////////////////////////////
// Validator functions (Cross field)
////////////////////////////////////////

function emailMatcher(control: AbstractControl): { [key: string]: boolean } | null {
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
function ratingRange(control: AbstractControl): { [key: string]: boolean } | null {
    const input = control.value;
    if (input !== undefined && (isNaN(input) || input < 1 || input > 5)) {
        // the returned rule name matches the one defined in the HTML (range)
        return { 'range': true };
    } else {
        return null;
    }
}

/**
 * If we want to use the validator function with parameters, it needs to be wrapped within a factory function which returns it.
 */
function ratingRangeWithParams(min: number, max: number): ValidatorFn {
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

    constructor(private fb: FormBuilder) {
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
            }, { validator: emailMatcher }),
            phone: '',
            notification: 'email',
            rating: ['', ratingRangeWithParams(1, 5)],
            sendCatalog: true
        });

        // Watches the value changes of notification formControl
        this.customerForm.get('notification').valueChanges.subscribe(value => this.setNotification(value));
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

    /*
    populateAll(): void {
        // attribute names of the object passed into setValue must match the names of the formControl
        this.customerForm.setValue({
            firstName: 'Jack',
            lastName: 'Ma',
            email: 'Jack.Ma@alibaba.com',
            sendCatalog: false
        });
    }

    populateEmail(): void {
        // attribute names of the object passed into setValue must match the names of the formControl
        this.customerForm.patchValue({
            email: 'me@aexample.com'
        });
    }
    */
}
