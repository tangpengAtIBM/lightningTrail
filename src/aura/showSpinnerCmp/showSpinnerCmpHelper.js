({
    showHideSpinner : function(component) {
        var showValue = component.get('v.show');
        
        if(showValue) {
            console.log('showValue'+showValue);
            var spinner = component.find("spinner");
            console.log('spinner'+spinner);
        	$A.util.removeClass(spinner, "slds-hide");
        } else {
            console.log('showValue'+showValue);
            var spinner = component.find("spinner");
            console.log('spinner'+spinner);
        	$A.util.addClass(spinner, "slds-hide");
        }
    }

})