({
	editRecordHandler : function(component, event, helper) {
		component.set("v.currView","RecordEdit");
        //alert('editRecordHandler called');
	},
    goBack : function (component, event, helper){
        // Reload the view so components 
        component.set("v.currView","ListView");
    },
    deleteRecordHandler: function(component, event, helper) {
        component.find("recordLoader").deleteRecord($A.getCallback(function(saveResult) {
            if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
				// Deleted! Show a toast UI message
                // toast supported in lightning experience only
                console.log('Record delete from View page get called');
                var resultsToast = $A.get("e.force:showToast");
                console.log('resultsToast value:'+resultsToast);
                if(resultsToast){
                    resultsToast.setParams({
                        "title": "Deleted",
                        "message": "The record is deleted."
                    });
                    resultsToast.fire();
                    $A.get("e.force:refreshView").fire();   
                }else{
                    component.set("v.isRecordDeleted","true");
                }
            }
            else {
                var errmsg='Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error);
                    console.log(errmsg);
                    alert(errmsg);
            }
        }));
    }
})