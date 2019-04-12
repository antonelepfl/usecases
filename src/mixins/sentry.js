import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

const sentryDsn = process.env.VUE_APP_SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true,
      }),
    ],
  });
}
