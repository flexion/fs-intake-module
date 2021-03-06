import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApplicationFieldsService } from '../_services/application-fields.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html'
})
export class ExperienceComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() pointOfView: string;
  experienceFields = 'experienceFields';

  constructor(private formBuilder: FormBuilder, public afs: ApplicationFieldsService) {}

  ngOnInit() {
    const experienceFields = this.formBuilder.group({
      haveNationalForestPermits: [false],
      listAllNationalForestPermits: ['', Validators.maxLength(512)],
      haveOtherPermits: [false],
      listAllOtherPermits: ['', Validators.maxLength(512)],
      haveCitations: [false],
      listAllCitations: ['', Validators.maxLength(512)]
    });
    this.parentForm.addControl('experienceFields', experienceFields);

    this.afs.simpleRequireToggle(
      this.parentForm.get('experienceFields.haveNationalForestPermits'),
      this.parentForm.get('experienceFields.listAllNationalForestPermits')
    );

    this.afs.simpleRequireToggle(
      this.parentForm.get('experienceFields.haveOtherPermits'),
      this.parentForm.get('experienceFields.listAllOtherPermits')
    );

    this.afs.simpleRequireToggle(
      this.parentForm.get('experienceFields.haveCitations'),
      this.parentForm.get('experienceFields.listAllCitations')
    );
  }
}
