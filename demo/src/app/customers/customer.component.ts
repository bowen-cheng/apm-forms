import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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

    ngOnInit(): void {
        // Creating the form model
        this.customerForm = new FormGroup({
          firstName: new FormControl(),
          lastName: new FormControl(),
          email: new FormControl(),
          sendCatalog: new FormControl(true),
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
            email: 'me@aexample.com',
        });
    }
}
