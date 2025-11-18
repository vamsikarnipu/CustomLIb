sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit TestSuite for mathbasics",
		defaults: {
			ui5: {
				libs: ["sap.ui.core", "mathbasics"],
				theme: "sap_horizon"
			},
			qunit: {
				version: 2,
				reorder: false
			},
			sinon: {
				version: 4,
				qunitBridge: true,
				useFakeTimers: false
			},
			coverage: {
				only: ["mathbasics/"],
				never: ["test-resources/"]
			}
		},
		tests: {
			// test file for the Example control
			Example: {
				title: "QUnit Test for Example",
				_alternativeTitle: "QUnit tests: mathbasics.Example"
			}
		}
	};
});
