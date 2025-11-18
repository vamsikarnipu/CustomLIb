sap.ui.define([
	"./BaseController", 
	"sap/m/MessageBox",
	"mathbasics/BasicMath"
], function (BaseController, MessageBox, BasicMath) {
	"use strict";

	return BaseController.extend("com.genpact.controller.Main", {
		sayHello: function () {
			MessageBox.show("Hello World!");
		},

		onTestMath: function () {
			try {
				// Use BasicMath from the deployed library
				var sum = BasicMath.add(10, 50);
				var product = BasicMath.multiply(5, 4);
				var difference = BasicMath.subtract(50, 30);
				var quotient = BasicMath.divide(100, 5);

				var message = "Math Operations Results:\n\n" +
					"10 + 20 = " + sum + "\n" +
					"5 × 4 = " + product + "\n" +
					"50 - 30 = " + difference + "\n" +
					"100 ÷ 5 = " + quotient;

				MessageBox.show(message, {
					title: "BasicMath Library Test",
					icon: MessageBox.Icon.SUCCESS
				});
			} catch (error) {
				MessageBox.show("Error: " + error.message, {
					title: "Error",
					icon: MessageBox.Icon.ERROR
				});
			}
		}
	});
});
