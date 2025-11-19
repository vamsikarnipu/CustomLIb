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
      // Library loading is handled declaratively in manifest.json
      // FLP reads manifest.json BEFORE Component.js runs
      // resourceRoots tells FLP where to find the library
      // lazy: false ensures library loads before views are rendered
      // No manual loading needed - SAP-approved FLP method

      // Proceed with normal component initialization
      UIComponent.prototype.init.apply(this, arguments);

      // set the device model
      this.setModel(models.createDeviceModel(), "device");

      // enable routing
      this.getRouter().initialize();
    }
  });
});