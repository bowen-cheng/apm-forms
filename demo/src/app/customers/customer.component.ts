import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Customer } from './customer';

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
            email: ['default value', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
            sendCatalog: true
        });
    }

    save(): void {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm));
    }

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
}
