import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-api-error',
  templateUrl: './api-error.component.html'
})
export class ApiErrorComponent implements OnInit {
  @Input() errors: any;
  constructor() {}

  ngOnInit() {}
}
