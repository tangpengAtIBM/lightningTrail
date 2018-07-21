({
    doInit: function(component, event, helper) {
        var accRecordTypeValue = null;
        if(component.get("v.accountRecordType")){
            accRecordTypeValue = component.get("v.accountRecordType");
        }
        if(component.get("v.recordId")=="" || component.get("v.recordId")==null){
            // Prepare a new record from template
            console.log('doinit is called while creating new record remplate');
            // Prepare a new record from template
            component.find("newAccountCreator").getNewRecord(
                "Account", // sObject type (entityApiName)
                accRecordTypeValue,      // recordTypeId
                false,     // skip cache?
                $A.getCallback(function() {
                    var rec = component.get("v.record");
                    var error = component.get("v.recordError");
                    if(error || (rec === null)) {
                        console.log("Error initializing record template: " + error);
                        return;
                    }
                    console.log("Record template initialized: " + rec.sobjectType);
                })
            );
        }
    },    
    
    updateRecord: function(component, event, helper) {
        //console.log(component.find("recordHandler"));
        if(component.get("v.recordId")!= null){
            //alert('update record logic');
            component.find("recordHandler").saveRecord($A.getCallback(function(saveResult) {
                if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                    // Saved! Show a toast UI message
                    // toast supported in lightning experience only
                    console.log('Update record get called from edit page ');
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
                        console.log('updated record and isRecordDeleted is marked as true');
                    }
                }
                else {
                    var errmsg='Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error);
                    console.log(errmsg);
                    alert(errmsg);}
            }));
        }else{
            //alert('new record logic'); 
            
            var selectedRecType=component.get("v.accountRecordType");
            //alert('selected recordtype:'+selectedRecType);
            if(selectedRecType!="" && selectedRecType!=null){
                component.set("v.recordInfo.RecordTypeId",selectedRecType);   
            }
            component.find("newAccountCreator").saveRecord(function(saveResult) {
                if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                    // Success! Prepare a toast UI message
                    // toast supported in lightning experience only
                    console.log('Update record get called from edit page ');
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
            });
        }
        
    },
    goToView :function(component, event, helper){
        component.set("v.currView","ListView");   
    }
})