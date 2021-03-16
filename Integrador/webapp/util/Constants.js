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
                // dialogSearch: "idDialogBusqueda",
            }
        },

        routes: {
            main: "Main",
            JSON: {
                productos: "Productos.json",
                proveedor: "Proveedor.json",
                datosBusqueda: "modalSearch.json"
            },
            FRAGMENTS: {
                dialogProducts: "Integrador.Integrador.fragments.Tabla",
                dialogSearch: "Integrador.Integrador.fragments.Dialog"
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