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
      // --- CRITICAL: Load library BEFORE base init (for FLP) ---
      // FLP reads manifest.json and tries to load libraries BEFORE Component.js init runs
      // We must load the library IMMEDIATELY so FLP knows where to find it
      // For HTML5-Repo apps, destination must be configured at SUBACCOUNT level (not app level)
      // Launchpad's app-router will resolve /destinations/mathbasics-library/... path
      sap.ui.getCore().loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");

      // --- Proceed with normal component initialization ---
      UIComponent.prototype.init.apply(this, arguments);

      // set the device model
      this.setModel(models.createDeviceModel(), "device");

      // enable routing
      this.getRouter().initialize();
    }
  });
});