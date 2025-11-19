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
      // --- Map and load the custom library BEFORE base init ---
      // Detect BAS vs FLP/Central AppRouter. In BAS preview URLs usually contain "studio".
      var isBAS = typeof location !== "undefined" && location.host && location.host.indexOf("studio") > -1;

      // Base path for the mathbasics library:
      //  - In FLP / Central AppRouter: use destination route to your CF app
      //  - In BAS: either use mockDestinations (same destination path) or a local copy under webapp/lib/mathbasics
      var basePath = isBAS
        ? "/destinations/mathbasics-library/resources/mathbasics/" // if you configured BAS mockDestinations
        // If you prefer a local copy in BAS, change to: "./lib/mathbasics/"
        : "/destinations/mathbasics-library/resources/mathbasics/";

      // Tell UI5 where to load the custom library from (namespace must match your library.js initLibrary name)
      // e.g., sap.ui.getCore().initLibrary({ name: "mathbasics", ... })
      sap.ui.getCore().loadLibrary("mathbasics", basePath);

      // --- Proceed with normal component initialization ---
      UIComponent.prototype.init.apply(this, arguments);

      // set the device model
      this.setModel(models.createDeviceModel(), "device");

      // enable routing
      this.getRouter().initialize();
    }
  });
});