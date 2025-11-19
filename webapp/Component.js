sap.ui.define([
  "sap/ui/core/UIComponent",
  "project3/model/models"
], function (UIComponent, models) {
  "use strict";

  return UIComponent.extend("project3.Component", {
    metadata: {
      manifest: "json",
      interfaces: [
        "sap.ui.core.IAsyncContentCreation"
      ]
    },

    init: function () {
      // --- Load the custom library BEFORE base init (CRITICAL for FLP) ---
      // FLP reads manifest.json first and tries to load libraries before Component.js runs
      // We must load the library here BEFORE calling base init to prevent FLP from trying to load from wrong location
      
      // Load library via destination - works for both FLP and HTML5 App Repo
      // The destination route in xs-app.json will forward /destinations/mathbasics-library/... to the actual library URL
      if (!sap.ui.getCore().getLoadedLibraries()["mathbasics"]) {
        sap.ui.getCore().loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");
      }

      // --- Proceed with normal component initialization ---
      UIComponent.prototype.init.apply(this, arguments);

      // set the device model
      this.setModel(models.createDeviceModel(), "device");

      // enable routing
      this.getRouter().initialize();
    }
  });
});