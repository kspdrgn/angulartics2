import { Injectable } from '@angular/core';

import { Angulartics2 } from '../core/angulartics2';

declare var dataLayer: any;

@Injectable()
export class Angulartics2GoogleTagManager {

  constructor(
    readonly angulartics2: Angulartics2
  ) {

    this.angulartics2.settings.pageTracking.trackRelativePath = true;

    // Set the default settings for this module
    this.angulartics2.settings.gtm = {
      userId: null
    };

    this.angulartics2.pageTrack.subscribe((x: any) => this.pageTrack(x.path));

    this.angulartics2.eventTrack.subscribe(x => this.eventTrack(x.action, x.properties));

    this.angulartics2.exceptionTrack.subscribe((x: any) => this.exceptionTrack(x));

    this.angulartics2.setUsername.subscribe((x: string) => this.setUsername(x));
  }

  /**
   * Send content views to the dataLayer
   *
   * @param {string} path Required 'content name' (string) describes the content loaded
   */
  pageTrack(path: string) {
    if (!dataLayer) {
      dataLayer = (<any>window).dataLayer = (<any>window).dataLayer || [];
    }

    dataLayer.push({
      'event': 'content-view',
      'content-name': path,
      'userId': this.angulartics2.settings.gtm.userId
    });
  }

  /**
   * Send interactions to the dataLayer, i.e. for event tracking in Google Analytics
   * @name eventTrack
   *
   * @param {string} action Required 'action' (string) associated with the event
   * @param {object} properties Comprised of the mandatory field 'category' (string) and optional  fields 'label' (string), 'value' (integer) and 'noninteraction' (boolean)
   */
  eventTrack(action: string, properties: any) {
    if (!dataLayer) {
      dataLayer = (<any>window).dataLayer = (<any>window).dataLayer || [];
    }
    properties = properties || {};
    dataLayer.push({
      'event': properties.event || 'interaction',
      'target': properties.category,
      'action': action,
      'target-properties': properties.label,
      'value': properties.value,
      'interaction-type': properties.noninteraction,
      'userId': this.angulartics2.settings.gtm.userId
    });
  }

  /**
   * Exception Track Event in GA
   * @name exceptionTrack
   *
   * @param {object} properties Comprised of the mandatory fields 'appId' (string), 'appName' (string) and 'appVersion' (string) and 
   * optional  fields 'fatal' (boolean) and 'description' (string)
   *
   * @https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
   *
   * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/events
   */
  exceptionTrack(properties: any) {
    let errorString = 'errar';
    let label = 'some label stuff';
    this.eventTrack(errorString, {
      'category': 'Exceptions',
      'label': label
    });
  }

  /**
   * Set userId for use with Universal Analytics User ID feature
   * @name setUsername
   * 
   * @param {string} userId Required 'userId' value (string) used to identify user cross-device in Google Analytics
   */
  setUsername(userId: string) {
    this.angulartics2.settings.gtm.userId = userId;
  }
}
