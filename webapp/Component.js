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
      // --- Register resource root BEFORE base init (required for FLP) ---
      // FLP reads manifest.json and tries to load libraries BEFORE Component.js runs
      // We must register the resource root IMMEDIATELY so FLP knows where to find the library
      // manifest.json declares the library dependency, but resource root must be registered here
      var oCore = sap.ui.getCore();
      
      // Register resource root - tells UI5 where to find mathbasics library files
      // This must be done BEFORE base init so library can be loaded from manifest.json
      // Safe to call multiple times - will just update if already registered
      oCore.registerResourceRoot("mathbasics", "/destinations/mathbasics-library/resources/mathbasics/");

      // --- Proceed with normal component initialization ---
      // manifest.json will handle loading the library (declared in dependencies)
      UIComponent.prototype.init.apply(this, arguments);

      // set the device model
      this.setModel(models.createDeviceModel(), "device");

      // enable routing
      this.getRouter().initialize();
    }
  });
});