import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { ApplicationService } from '../_services/application.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MockRouter } from '../_mocks/routes.mock';
import { MockBackend } from '@angular/http/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as sinon from 'sinon';

describe('Application Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, HttpClientTestingModule, RouterTestingModule],
      providers: [ApplicationService, { provide: XHRBackend, useClass: MockBackend }]
    });
  });

  it(
    'should call create',
    inject([ApplicationService], service => {
      const spy = sinon.spy(service, 'create');
      service.create({}, 'noncommercial', true);
      expect(spy.called).toBeTruthy();
    })
  );

  it(
    'should call get',
    inject([ApplicationService], service => {
      const spy = sinon.spy(service, 'get');
      service.get();
      expect(spy.called).toBeTruthy();
      service.get('test');
      expect(spy.called).toBeTruthy();
    })
  );

  it(
    'should call getOne',
    inject([ApplicationService], service => {
      const spy = sinon.spy(service, 'getOne');
      service.getOne('id');
      expect(spy.called).toBeTruthy();
      service.getOne('id', 'test');
      expect(spy.called).toBeTruthy();
    })
  );

  it(
    'should call update',
    inject([ApplicationService], service => {
      const spy = sinon.spy(service, 'update');
      service.update({}, 'noncommercial');
      expect(spy.called).toBeTruthy();
    })
  );

  it(
    'should call handleStatusCode',
    inject([ApplicationService], service => {
      const spy = sinon.spy(service, 'handleStatusCode');
      service.handleStatusCode(403);
      service.handleStatusCode(402);
      expect(spy.calledTwice).toBeTruthy();
    })
  );

  it(
    'should call handleStatusCode',
    inject([ApplicationService], service => {
      const spy = sinon.spy(service, 'handleError');
      service.handleError('error');
      service.handleError(
        new Response(
          new ResponseOptions({
            body: JSON.stringify({ test: 'data' })
          })
        )
      );
      service.handleError(
        new Response(
          new ResponseOptions({
            body: JSON.stringify({}),
            status: 403
          })
        )
      );
      expect(spy.calledThrice).toBeTruthy();
    })
  );
});
