sap.ui.define([
        
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "Integrador/Integrador/util/Constants",
    "Integrador/Integrador/util/Formatter",
    "Integrador/Integrador/util/Services",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, JSONModel, Fragment, Constants, Formatter, Services, MessageToast, Filter, FilterOperator) {
		"use strict";

		return Controller.extend("Integrador.Integrador.controller.Main", {
            	Formatter: Formatter,
		    onInit: function () {
                this.loadModel();
                this.loadModelDatos();
                this.loadModelProveedores();

            },
            
            loadModel: async function() {
                let oComponent = this.getOwnerComponent();

                const oResponse = await Services.getLocalJSON(Constants.routes.JSON.productos);
                const oData = oResponse[0];

                let oProductosModel = new JSONModel();
                oProductosModel.setData(oData);

                oComponent.setModel(oProductosModel, "ProductosJSON");
            },

            loadModelDatos: async function() {
                let oComponent = this.getOwnerComponent();

                const oResponseS = await Services.getLocalJSON(Constants.routes.JSON.datosBusqueda);
                const oDataS = oResponseS[0];

                let oSearchModel = new JSONModel();
                oSearchModel.setData(oDataS);

                this.getView().setModel(oSearchModel, "MensajeJSON");
            },

            loadModelProveedores: async function() {
                let oComponent = this.getOwnerComponent();

                const oResponseP = await Services.getLocalJSON(Constants.routes.JSON.proveedor);
                const oDataP = oResponseP[0];

                let oSupplierModel = new JSONModel();
                oSupplierModel.setData(oDataP);

                this.getView().setModel(oSupplierModel, "ProveedoresJSON");
            },

            onPress: function(){
                let oMessageBox = this.getView().getModel(Constants.modelo.MODEL_MENSAJE);
                let dFecha = oMessageBox.getProperty("/datos/0/fecha");
                let sProveedor = oMessageBox.getProperty("/datos/0/proveedor");
                let sPais = oMessageBox.getProperty("/datos/0/pais");

                MessageToast.show(
                    `Fecha: ${dFecha}
                    Proveedor: ${sProveedor}
                    Pais: ${sPais}
                    `);
            },

            onCloseDialog: function(){
                this.byId(Constants.ids.FRAGMENTS.dialogProducts).close();
                if(!this.pDialog){
                    this.pDialog = Fragment.load({
                        id: oView.getId(),
                        name: Constants.routes.FRAGMENTS.dialogSearch,
                        controller: this
                    }). then(function (oDialog) {
                            oView.addDependent(oDialog);
                            return oDialog;
                        });
                    }   this.pDialog.then(function(oDialog) {
                    oDialog.open();
                    });
                
                
                
                var oPanel = this.byId("idPanel");
                oPanel.setExpanded(!oPanel.getExpanded());
            },

            onSearch: function(evt){

                let aFilter=[];

                let sBusqueda = evt.getSource().getValue(); 

                if (sBusqueda && sBusqueda.length >0){
                    let oFilter = new Filter("pais", FilterOperator.Contains, sBusqueda);
                    aFilter.push(oFilter); // BUSQUEDA POR PAIS

                   var oFiltros = new Filter(aFilter);
                }

                let oTable = this.getView().byId("idTabla");
                let oBinding = oTable.getBinding("items"); 

                oBinding.filter(oFiltros, "Application");
            },
        });

            
            /* 
            let oModel = new JSONModel(oProveedores);
                this.getOwnerComponent().setModel(oModel, "Proveedores");

                let oTools = {
                    key: null,
                };

                let oModelTools = new JSONModel(oTools);
                this.getOwnerComponent().setModel(oModelTools, "ToolsModel");


            },
                        */
    },
        
);        


