import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Customer } from './customer';

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
        //
        return { 'range': true };
    } else {
        return null;
    }
}

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
            firstName: ['default value', [Validators.required, Validators.minLength(3)]],
            lastName: ['default value', [Validators.required, Validators.maxLength(50)]],
            email: ['default@email.com', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
            phone: '',
            notification: 'email',
            rating: ['', ratingRange],
            sendCatalog: true
        });
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
