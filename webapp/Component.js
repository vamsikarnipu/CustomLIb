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
      // CRITICAL: Load library BEFORE base init (for FLP)
      // FLP reads manifest.json and tries to load libraries declared there
      // Since we removed mathbasics from manifest.json to prevent CDN loading,
      // we must load it here BEFORE base init runs
      var oCore = sap.ui.getCore();
      
      // Load library if not already loaded
      // loadLibrary automatically registers the resource root
      if (!oCore.getLoadedLibraries()["mathbasics"]) {
        oCore.loadLibrary("mathbasics", "/destinations/mathbasics-library/resources/mathbasics");
      }

      // Proceed with normal component initialization
      UIComponent.prototype.init.apply(this, arguments);

      // set the device model
      this.setModel(models.createDeviceModel(), "device");

      // enable routing
      this.getRouter().initialize();
    }
  });
});