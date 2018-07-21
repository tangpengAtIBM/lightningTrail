({
    doInit : function(component, event, helper){
        var params ={};
        helper.callServer(
            component,
            "c.findRecords",
            function(response){
                component.set("v.recList",response);
            },
            params
        );
        
    },
    confirmDelete : function(component, event, helper){
        var selectedId =component.get("v.selectedRecord");
        component.set("v.recordIdToDelete",selectedId);
        console.log('*******recordIdToDelete:'+component.get("v.selectedRecord"));
        component.find("recordDeleteHandler").deleteRecord($A.getCallback(function(saveResult) {
            if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                // Deleted! Show a toast UI message
                // toast supported in lightning experience only
                console.log('Delete is successfull');
                var resultsToast = $A.get("e.force:showToast");
                if(resultsToast){
                    resultsToast.setParams({
                        "title": "Deleted",
                        "message": "The record is deleted."
                    });
                    resultsToast.fire();
                    $A.get("e.force:refreshView").fire();   
                }else{
                    console.log(' Refreshing list view');
                    //refresh list view
                    var params ={};
                    helper.callServer(
                        component,
                        "c.findRecords",
                        function(response){
                            component.set("v.recList",response);
                            component.set("v.currentView","ListView");
                        },
                        params
                    );
                }
                
            }else {
                var errmsg='Unknown problem, state: ' + saveResult.state +', error: ' + JSON.stringify(saveResult.error);
                console.log(errmsg);
                alert(errmsg);
            }
        }));   
    },
    onSelectMenuItem : function(component, event, helper) {
        var selectedOption = event.getSource().get('v.value');
        var selectedId = selectedOption.split('---')[0];
        //alert('*************selectedId:'+selectedId+':selected action:'+selectedOption);
        component.set("v.selectedRecord",selectedId);
        //console.log(event.getSource());  
        if (selectedOption.endsWith("Delete")) {
            component.set("v.recordIdToDelete",selectedId);
            console.log('record id to delete:'+component.get("v.recordIdToDelete"));
            component.set("v.currentView","RecordDeleteConfirm"); 
        }else if(selectedOption.endsWith("View")){
            component.set("v.currentView","RecordView"); 
        }else if(selectedOption.endsWith("Edit")){
            component.set("v.currentView","RecordEdit");
        }
    },
    showSpinner: function(component, event, helper) {
        var spinner = component.find("spinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    hideSpinner: function(component, event, helper) {
        //alert('hideSpinner');
        var spinner = component.find("spinner");
        $A.util.addClass(spinner, "slds-hide");
    },
    createRecordhandler : function(component, event, helper){
        component.set("v.selectedRecord",null);
        
        //component.set("v.selectedRecord","");
        //if you pass blank value, then you will get error saying record is either deleted or doesnot exist. specify null
        //Call to server to find out if recordType exist for Account
        var params ={};
        helper.callServer(
            component,
            "c.findRecordTypes",
            function(response){
                //alert('Response from controller for recordtypes:'+JSON.stringify(response));
                if(response!=''){
                    var jsonObject=JSON.parse(response);
                    component.set("v.recordTypeList",jsonObject);   
                    component.set('v.selectedRecordType',jsonObject[0].recordTypeId); 
                    //component.find("srd").set("v.value",jsonObject[0].recordTypeId);
                    if(jsonObject.length >1){
                        //alert('more than 2 record type');
                        component.set("v.currentView","RecordTypeSelection");
                    }else{
                        //alert('only 1 record type');
                        component.set("v.currentView","RecordEdit");
                    }
                }else{
                    //alert('RecordType doesnot exist');
                    component.set('v.selectedRecordType',null); 
                    component.set("v.currentView","RecordEdit");
                }
            },
            params
        );
    },
    defaultCloseAction : function(component, event, helper) {
        $A.util.addClass(component, "slds-hide");
        component.set("v.currentView","ListView");
    },
    onconfirm : function(component, event, helper){
        //alert('confirm get called');
        var selectedRecType=component.get("v.selectedRecordType");
        component.set("v.currentView","RecordEdit");
    },  
    onChangeRecordType : function(component, event,helper){
        var recordTypeValue = event.getSource().get("v.value");
        component.set('v.selectedRecordType', recordTypeValue);
        
    },
    refreshListView : function(component,event,helper){
        console.log('isRefreshRequired value:'+ component.get("v.isRefreshRequired"));
        if(component.get("v.isRefreshRequired") == "true"){
            console.log('******List view is getting refreshed');
            //refresh list view
            var params ={};
            helper.callServer(
                component,
                "c.findRecords",
                function(response){
                    component.set("v.recList",response);
                    component.set("v.currentView","ListView");
                },
                params
            );   
        }
        component.set("v.isRefreshRequired","false");
        
    }
})