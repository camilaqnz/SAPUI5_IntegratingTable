sap.ui.define([], function(){
    "use strict";
    return {
        model:{
            I18N: "i18n",
        },

        properties: {

        },

        ids: {
            FRAGMENTS: {
                dialogProducts: "idDProductos",
                dialogSearch: "idDialogBusqueda",
                sortDialog: "idSortDialog"
            }
        },

        routes: {
            main: "Main",
            JSON: {
                productos: "Productos.json",
                proveedor: "Proveedores.json",
                datosBusqueda: "modalSearch.json"
            },
            FRAGMENTS: {
                dialogTable: "Integrador.Integrador.fragments.Tabla",
                dialogSearch: "Integrador.Integrador.fragments.Dialog",
                dialogSort: "Integrador.Integrador.fragments.SortDialog",
                dialogGroup: "Integrador.Integrador.fragments.GroupDialog",
                dialogFilter: "Integrador.Integrador.fragments.FilterDialog"
                
            }
        },

        modelo: {
            MODEL_PRODUCTOS: "ProductosJSON",
            MODEL_PROVEEDORES: "ProveedoresJSON",
            MODEL_MENSAJE: "MensajeJSON"
        },

        formatter: {
            PRICE: "EUR",
            }
    };
}, true);