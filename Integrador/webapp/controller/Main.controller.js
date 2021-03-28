sap.ui.define([

    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "Integrador/Integrador/util/Constants",
    "Integrador/Integrador/util/Formatter",
    "Integrador/Integrador/util/Services",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/Device",
    "sap/ui/model/Sorter",
    "sap/m/library"
],
	/**
      * @param {typeof sap.ui.core.mvc.Controller} Controller
      */
    function (Controller, JSONModel, Fragment, Constants, Formatter, Services, MessageToast, Filter, FilterOperator, Device, Sorter, mLibrary) {
        "use strict";

        return Controller.extend("Integrador.Integrador.controller.Main", {
            Formatter: Formatter,
            onInit: function () {

                //Me creo una variable global que va a almacenar los fragments creados
                this._mViewSettingsDialogs = {};

                this.loadModel();
                this.loadModelDatos();
                this.loadModelProveedores();

                this.mGroupFunctions = {
                    producto: function (oContext) {
                        var sProducto = oContext.getProperty("producto");
                        return {
                            key: sProducto,
                            text: sProducto
                        };
                    },

                    proveedor: function (oContext) {
                        var sProveedor = oContext.getProperty("proveedor");
                        return {
                            key: sProveedor,
                            text: sProveedor
                        };
                    },

                    cod_product: function (oContext) {
                        var sCodigo = oContext.getProperty("cod_product");
                        return {
                            key: sCodigo,
                            text: sCodigo
                        };
                    },

                    pais: function (oContext) {
                        var sPais = oContext.getProperty("pais");
                        return {
                            key: sPais,
                            text: sPais
                        };
                    },

                    valor: function (oContext) {
                        var sValor = oContext.getProperty("valor");
                        return {
                            key: sValor,
                            text: sValor
                        };
                    },

                    peso: function (oContext) {
                        var sPeso = oContext.getProperty("peso");
                        return {
                            key: sPeso,
                            text: sPeso
                        };
                    }
                };
            },

            loadModel: async function () {
                let oComponent = this.getOwnerComponent();

                const oResponse = await Services.getLocalJSON(Constants.routes.JSON.productos);
                const oData = oResponse[0];

                let oProductosModel = new JSONModel();
                oProductosModel.setData(oData);

                oComponent.setModel(oProductosModel, "ProductosJSON");
            },

            loadModelDatos: async function () {
                let oComponent = this.getOwnerComponent();

                const oResponseS = await Services.getLocalJSON(Constants.routes.JSON.datosBusqueda);
                const oDataS = oResponseS[0];

                let oSearchModel = new JSONModel();
                oSearchModel.setData(oDataS);

                this.getView().setModel(oSearchModel, "MensajeJSON");
            },

            loadModelProveedores: async function () {
                let oComponent = this.getOwnerComponent();

                const oResponseP = await Services.getLocalJSON(Constants.routes.JSON.proveedor);
                const oDataP = oResponseP[0];

                let oSupplierModel = new JSONModel();
                oSupplierModel.setData(oDataP);

                this.getView().setModel(oSupplierModel, "ProveedoresJSON");
            },

            onPress: function () {

                let oView = this.getView();
                if (!this._oFragment) {
                    this._oFragment = sap.ui.xmlfragment("idDialog", Constants.routes.FRAGMENTS.dialogSearch, this);
                    this.getView().addDependent(this._oFragment);
                }
                this._oFragment.open();

                /* if(!this.pDialog){
                    this.pDialog = Fragment.load({
                        id: oView.getId(),
                        name: "Integrador.Integrador.fragments.Dialog",
                        controller: this
                    }). then(function (oDialog) {
                            oView.addDependent(oDialog);
                            return oDialog;
                        });
                    }   this.pDialog.then(function(oDialog) {
                    oDialog.open();
                    }); */
            },

            onCloseDialog: function () {
                this._oFragment.close();

                var oPanel = this.getView().byId("idPanel");
                oPanel.setExpanded(!oPanel.getExpanded());
            },

            onSearch: function (evt) {
                let aFilter = [];
                let sBusqueda = evt.getSource().getValue();

                if (sBusqueda && sBusqueda.length > 0) {
                    let oFilter = new Filter("pais", FilterOperator.Contains, sBusqueda);
                    aFilter.push(oFilter); // BUSQUEDA POR PAIS

                    var oFiltros = new Filter(aFilter);
                }

                let oTable = this.getView().byId("idTabla");
                let oBinding = oTable.getBinding("items");
                oBinding.filter(oFiltros, "Application");
            },

            //FUNCION PARA CREAR DIALOGOS 
            createViewSettingsDialog: function (sDialogFragmentName) {
                // var oDialog;

                var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
                    this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;
                    this.getView().addDependent(oDialog);
                }
                    oDialog.setFilterSearchOperator(mLibrary.StringFilterOperator.Contains);

                    if (sDialogFragmentName === Constants.routes.FRAGMENTS.dialogFilter) {
                    var oModelFilterJSON = this.getOwnerComponent().getModel("ProductosJSON");
                    var modelOriginal = oModelFilterJSON.getProperty("/productos");
                    var jsonProducto = JSON.parse(JSON.stringify(modelOriginal, ["producto"])); //era jsonOrigen
                    var jsonCodProducto = JSON.parse(JSON.stringify(modelOriginal, ["cod_product"]));
                    var jsonProveedor = JSON.parse(JSON.stringify(modelOriginal, ["proveedor"]));
                    var jsonPeso = JSON.parse(JSON.stringify(modelOriginal, ["peso"]));
                    var jsonValor = JSON.parse(JSON.stringify(modelOriginal, ["valor"]));
                    var jsonPais = JSON.parse(JSON.stringify(modelOriginal, ["pais"]));

                    oDialog.setModel(oModelFilterJSON);
                

                //check for duplicates in filter items
                jsonProducto = jsonProducto.filter(function (currentObject) {
                    if (currentObject.producto in jsonProducto) {
                        return false;
                    } else {
                        jsonProducto[currentObject.producto] = true;
                        return true;
                    }
                });
                jsonCodProducto = jsonCodProducto.filter(function (currentObject) {
                    if (currentObject.cod_product in jsonCodProducto) {
                        return false;
                    } else {
                        jsonCodProducto[currentObject.cod_product] = true;
                        return true;
                    }
                });
                jsonProveedor = jsonProveedor.filter(function (currentObject) {
                    if (currentObject.proveedor in jsonProveedor) {
                        return false;
                    } else {
                        jsonProveedor[currentObject.proveedor] = true;
                        return true;
                    }
                });
                jsonPeso = jsonPeso.filter(function (currentObject) {
                    if (currentObject.peso in jsonPeso) {
                        return false;
                    } else {
                        jsonPeso[currentObject.peso] = true;
                        return true;
                    }
                });
                jsonValor = jsonValor.filter(function (currentObject) {
                    if (currentObject.valor in jsonValor) {
                        return false;
                    } else {
                        jsonValor[currentObject.valor] = true;
                        return true;
                    }
                });
                jsonPais = jsonPais.filter(function (currentObject) {
                    if (currentObject.pais in jsonPais) {
                        return false;
                    } else {
                        jsonPais[currentObject.pais] = true;
                        return true;
                    }
                });

                //create items arrays and iterate
                var aProductoFilter = [];
                for (var i = 0; i < jsonProducto.length; i++) {
                    aProductoFilter.push(
                    new sap.m.ViewSettingsItem({
                        text: jsonProducto[i].producto,
                        key: "producto"
                        })
                   );
                }

                var aCodProductoFilter = [];
                for (var i = 0; i < jsonCodProducto.length; i++) {
                    aCodProductoFilter.push(
                    new sap.m.ViewSettingsItem({
                        text: jsonCodProducto[i].cod_product,
                        key: "cod_product"
                        })
                   );
                }

                var aProveedorFilter = [];
                for (var i = 0; i < jsonProveedor.length; i++) {
                    aProveedorFilter.push(
                    new sap.m.ViewSettingsItem({
                        text: jsonProveedor[i].proveedor,
                        key: "proveedor"
                        })
                   );
                }

                var aPesoFilter = [];
                for (var i = 0; i < jsonPeso.length; i++) {
                    aPesoFilter.push(
                    new sap.m.ViewSettingsItem({
                        text: jsonPeso[i].peso,
                        key: "peso"
                        })
                   );
                }

                var aValorFilter = [];
                for (var i = 0; i < jsonValor.length; i++) {
                    aValorFilter.push(
                    new sap.m.ViewSettingsItem({
                        text: jsonValor[i].valor,
                        key: "valor"
                        })
                   );
                }

                var aPaisFilter = [];
                for (var i = 0; i < jsonPais.length; i++) {
                    aPaisFilter.push(
                    new sap.m.ViewSettingsItem({
                        text: jsonPais[i].pais,
                        key: "pais"
                        })
                   );
                }

                //set filter items and labels
                oDialog.destroyFilterItems();
                oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                    key: "producto",
                    text: "Producto",
                    items: aProductoFilter
                }));
                oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                    key: "cod_product",
                    text: "Código Producto",
                    items: aCodProductoFilter
                }));

                oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                    key: "proveedor",
                    text: "Proveedor",
                    items: aProveedorFilter
                }));
                
                oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                    key: "peso",
                    text: "Peso",
                    items: aPesoFilter
                }));
                
                oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                    key: "valor",
                    text: "Precio",
                    items: aValorFilter
                }));
                
                oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                    key: "pais",
                    text: "País",
                    items: aPaisFilter
                }));

                if (!Device.system.desktop) {
                    oDialog.addStyleClass("sapUiSizeCompact");
                    }

                    } return oDialog;
            },
    

        onSort: function () {
            this.createViewSettingsDialog(Constants.routes.FRAGMENTS.dialogSort).open();
        },

        onGroup: function () {
            var dialogo = this.createViewSettingsDialog(Constants.routes.FRAGMENTS.dialogGroup);
            dialogo.open();
        },

        onFilter: function () {
            var dialogoFilter= this.createViewSettingsDialog(Constants.routes.FRAGMENTS.dialogFilter);
            dialogoFilter.open();
        },


        onSortDialogConfirm: function (oEvent) {
            var oTable = this.byId("idTabla"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                sPath,
                bDescending,
                aSorters = [];
            sPath = mParams.sortItem.getKey();
            bDescending = mParams.sortDescending;
            aSorters.push(new Sorter(sPath, bDescending));
            oBinding.sort(aSorters);
        },


        onGroupDialogConfirm: function (oEvent) {
            var oTable = this.byId("idTabla"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                sPath,
                bDescending,
                vGroup,
                aGroups = [];
            if (mParams.groupItem) {
                sPath = mParams.groupItem.getKey();
                bDescending = mParams.groupDescending;
                vGroup = this.mGroupFunctions[sPath];
                aGroups.push(new Sorter(sPath, bDescending, vGroup));
                oBinding.sort(aGroups);
            } else {
                oBinding.aSorters = null;
                aGroups = [];
                oBinding.sort(aGroups);
                }
            },

            onFilterDialogConfirm: function (oEvent) {
                var oTable = this.byId("idTabla"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    aFilters = [];
                mParams.filterItems.forEach(function (oItem) {
                    var sPath = oItem.getKey(),
                        sOperator = FilterOperator.EQ,
                        sValue1 = oItem.getText();
                    var oFilter = new Filter(sPath, sOperator, sValue1);
                    aFilters.push(oFilter);
                });
                oBinding.filter(aFilters);
            },
        });
    },
);


