import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { SpecialUseApplication } from '../_models/special-use-application';

@Injectable()
export class ApplicationService {
  private endpoint = environment.apiUrl + 'permits/applications';

  constructor(private http: Http, public router: Router) {}

  create(body, type, multipart = false) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    if (multipart) {
      headers = new Headers({ 'Content-Type': 'application/json', enctype: 'multipart/form-data' });
    }
    const options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http
      .post(this.endpoint + type, body, options)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  get(params = '') {
    return this.http
      .get(this.endpoint + params, { withCredentials: true })
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  getOne(id, params = '') {
    return this.http
      .get(this.endpoint + params + id, { withCredentials: true })
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  update(body, type) {
    const bodyString = JSON.stringify(body);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http
      .put(`${this.endpoint}/special-uses/${type}/${body.appControlNumber}`, body, options)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  handleStatusCode(status) {
    if (status === 403) {
      this.router.navigate(['access-denied']);
    }
  }

  private handleError(error: Response | any) {
    let errors: any;
    if (error instanceof Response) {
      if (error.status) {
        if (error.status === 400) {
          const body = error.json() || '';
          errors = body.errors;
        }
        if (error.status === 401) {
          errors = [{ message: 'Please log in.' }];
        }
        if (error.status === 403) {
          errors = [{ message: 'Access denied.' }];
        }
        if (error.status === 404) {
          errors = [{ message: 'The requested application is not found.' }];
        }
        if (error.status === 500) {
          errors = [];
        }
      } else {
        const body = error.json() || '';
        errors = body.errors;
      }
    } else {
      errors = [];
    }
    return Observable.throw(errors);
  }
}
