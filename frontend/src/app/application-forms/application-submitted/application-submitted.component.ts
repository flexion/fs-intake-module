import { SpecialUseApplication } from '../../_models/special-use-application';
import { ApplicationService } from '../../_services/application.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-application-submitted',
  templateUrl: './application-submitted.component.html'
})
export class ApplicationSubmittedComponent implements OnInit {
  application: any = {};
  // TODO Use type in the template to filter content. type = 'noncommercial' or 'temp-outfitter'
  type: string;
  errorMessage: string;

  constructor(private applicationService: ApplicationService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.type = params['type'];
      this.applicationService.getOne(params['id'], `/special-uses/${this.type}/`).subscribe(
        application => (this.application = application),
        (e: any) => {
          this.errorMessage = 'The application could not be found.';
        }
      );
    });
  }
}
