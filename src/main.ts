import { enableProdMode, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from '@env';
import * as Sentry from '@sentry/angular';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Only catch error in production mode
if (!isDevMode()) {
  Sentry.init({
    dsn: environment.sentryDsn,
    sendDefaultPii: true,

    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // https://docs.sentry.io/platforms/javascript/session-replay/privacy/#privacy-configuration
        maskAllText: false,
        unmask: ['[data-sentry-unmask]', '.sentry-unmask'],
      }),
      // Sentry.feedbackIntegration(), // Show a widget in the bottom right corner
    ],


    tracePropagationTargets: ['api.hcmute.edu.vn'],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.1,

    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0,
    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 0.5,

    // Filter out event
    // beforeSend(event: Sentry.ErrorEvent) {
    //   const ignoreFilename = ['viewer', 'pdf'];
    //   try {
    //     if (ignoreFilename.includes(event.exception?.values?.[0]?.stacktrace?.frames?.[0]?.filename ?? '')) {
    //       return null;
    //     }
    //   } catch (e) {
    //     console.warn('Error in beforeSend Sentry', e);
    //   }

    //   return event;
    // },

    // Filter out event by name
    ignoreErrors: [
      '400', '401', '403', '404', 'zaloJSV2',
      'Non-Error exception captured',
      'Service workers are disabled',
      'Login providers not ready yet',
    ],
    denyUrls: ['/assets/'],
  });

  enableProdMode();
} else {
  console.warn('Sentry disabled in dev-mode.');
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
