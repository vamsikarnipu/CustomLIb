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
      // --- CRITICAL: Load library BEFORE base init (required for FLP) ---
      // FLP reads manifest.json and tries to load libraries BEFORE Component.js runs
      // If library is in manifest.json, FLP tries to load from default location (sapui5.hana.ondemand.com)
      // Solution: Remove library from manifest.json and load it directly here
      // This ensures library loads from destination path, not default UI5 CDN
      var oCore = sap.ui.getCore();
      
      // Register resource root FIRST - tells UI5 where to find mathbasics library files
      oCore.registerResourceRoot("mathbasics", "/destinations/mathbasics-library/resources/mathbasics/");
      
      // Load library directly with destination path - prevents FLP from loading from wrong location
      // This must be done BEFORE base init so library is available when Component.js initializes
      // loadLibrary() is safe to call multiple times - checks internally if already loaded
      oCore.loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");

      // --- Proceed with normal component initialization ---
      UIComponent.prototype.init.apply(this, arguments);

      // set the device model
      this.setModel(models.createDeviceModel(), "device");

      // enable routing
      this.getRouter().initialize();
    }
  });
});