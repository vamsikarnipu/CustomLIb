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
      // loadLibrary is safe to call multiple times - checks internally if already loaded
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