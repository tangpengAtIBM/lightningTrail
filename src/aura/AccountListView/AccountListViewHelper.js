({
	callServer : function(component, method, callback, params) {
        //alert('Calling helper callServer function');
        component.set("v.showSpinner",true);
		var action = component.get(method);
        if(params){
            action.setParams(params);
        }
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                callback.call(this,response.getReturnValue());
            }else if(state === "ERROR"){
                alert('Problem with connection. Please try again.');
            }
            component.set("v.showSpinner",false);
        });
		$A.enqueueAction(action);
        
    }
})