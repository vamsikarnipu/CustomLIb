sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: com.genpact",
		defaults: {
			page: "ui5://test-resources/com/genpact/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_horizon"
			},
			coverage: {
				only: "com/genpact/",
				never: "test-resources/com/genpact/"
			},
			loader: {
				paths: {
					"com/genpact": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for com.genpact"
			},
			"integration/opaTests": {
				title: "Integration tests for com.genpact"
			}
		}
	};
});
