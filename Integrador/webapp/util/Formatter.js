jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.define([
    "Integrador/Integrador/util/Constants",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/NumberFormat"
], function(Constants){    
    return {
        formatPrice: function (valor) {
            valor = parseInt(valor);
            return valor/160;
            },
            
        formatColor: function(fPeso) {
            fPeso = parseFloat(fPeso);
            
                if(!fPeso) {
                    return;
                } else {
                    if(fPeso < 1) {
                        return "Success"
                } else if (fPeso >= 1 && fPeso <= 2) {
                    return "Warning"
                } else {
                    return "Error"
                }
            }
        },
    }
});