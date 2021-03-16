/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"Integrador/Integrador/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
