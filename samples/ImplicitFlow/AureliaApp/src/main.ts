import { Aurelia } from "aurelia-framework";
import environment from "./environment";

// Configure Bluebird Promises.
// Note: You may want to use environment-specific configuration.
(<any> Promise).config({
  warnings: {
    wForgottenReturn: false,
  },
});

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin("./open-id/open-id", config => {
      console.log("open-id plugin callback");
    });

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin("aurelia-testing");
  }

  aurelia.start().then(() => aurelia.setRoot());
}
