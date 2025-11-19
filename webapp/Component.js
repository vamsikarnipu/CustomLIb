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
      // --- CRITICAL: Register resource root BEFORE base init (for FLP) ---
      // FLP reads manifest.json and tries to load libraries BEFORE Component.js init runs
      // We must register the resource root IMMEDIATELY so FLP knows where to find the library
      var oCore = sap.ui.getCore();
      
      // Register resource root FIRST (before any library loading attempts)
      // This tells UI5 where to find mathbasics library files
      if (!oCore.getResourceRoots()["mathbasics"]) {
        oCore.registerResourceRoot("mathbasics", "/destinations/mathbasics-library/resources/mathbasics/");
      }
      
      // Load library if not already loaded
      if (!oCore.getLoadedLibraries()["mathbasics"]) {
        oCore.loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");
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