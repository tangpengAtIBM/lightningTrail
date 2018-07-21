public class AccountListViewController {
    
    @auraEnabled
    public static List<Account> findRecords(){
        List<Account> returnList=new List<Account>();
        returnList=[select id,name,type,industry,RecordType.Name,RecordTypeId from Account order by LastModifiedDate DESC Limit 10];
    	return returnList;
    }
    
    @AuraEnabled
    public static string findRecordTypes(){
        string returnString='';
        List<RecordType> recordList = new List<RecordType> ();
        recordList= [Select id, name from RecordType where sobjectType ='Account' and IsActive=true];
        List<RecordTypeWrapper> wrapperList=new List<RecordTypeWrapper>();
        for(RecordType sb : recordList)  {
            RecordTypeWrapper rw=new RecordTypeWrapper();
            rw.recordTypeLabel=sb.name;
            rw.recordTypeId=sb.id;
            wrapperList.add(rw);
        } 
        if(wrapperList.size()>0){
        	returnString= JSON.serialize(wrapperList);   
        }
        system.debug('*****'+returnString);
        return returnString;
    }
    public class RecordTypeWrapper{
        public string recordTypeLabel{get;set;}
        public string recordTypeId{get;set;}
    }

}