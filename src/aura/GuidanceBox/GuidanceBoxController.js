({
    doInit : function(component) {
        console.log("guidance box init");
        
        //public static list<GuidanceBox__c> getGuidance(string recordId, string sobjectname, string field, boolean useRecordTypes){        
        var query = component.get("c.getGuidance");        
        var params = {
            "recordId" : component.get("v.recordId"), 
            "sobjectname" : component.get("v.sObjectName"),                     
            "field" : component.get("v.field"),  
            "useRecordTypes" : component.get("v.useRecordTypes")            
        };
        
        query.setParams(params);
        query.setCallback(this, function(a){
            console.log(a.getReturnValue());
            component.set("v.guidances", a.getReturnValue());    
            
            var getTopic = component.get("c.dynamicTopic");
            //public static String dynamicTopic(String WhichObject, String Field) {
            
            getTopic.setParams({
                "WhichObject" : component.get("v.sObjectName"), 
                "Field" : component.get("v.field")
            });
            getTopic.setCallback(this, function(b){
                
                //create a streamer dynamically with given topicName
                var topicName = b.getReturnValue();
                console.log(topicName);
                
                //TODO: dealing with failure!
                $A.createComponent(
                    "c:Streamer", 
                    {"topic" : topicName },
                    function (topicAdded, status){
                        console.log("trying to create streamer");
                        console.log(status);
                        
                        if (component.isValid()) {
                            var body = component.get("v.body");
                            body.push(topicAdded);
                            component.set("v.body", body);
                        }
                    }
                );
            });
            $A.enqueueAction(getTopic);
            
            
        });
        $A.enqueueAction(query);
    },
    
    listener : function(component, event, helper) {
        console.log('heard an event');
        var message = event.getParam("message");
        var recordId = message.data.sobject.Id;
        var value = message.data.sobject[component.get("v.field")];
        
        if (recordId === component.get("v.recordId")){
            console.log("I care about this update: " + message.data.sobject);
            console.log(recordId + " : " + value);
            
            var query = component.get("c.getGuidance");        
            var params = {
                "recordId" : component.get("v.recordId"), 
                "sobjectname" : component.get("v.sObjectName"),                     
                "field" : component.get("v.field"),  
                "useRecordTypes" : component.get("v.useRecordTypes")            
            };
            
            query.setParams(params);
            query.setCallback(this, function(a){
                console.log(a.getReturnValue());
                component.set("v.guidances", a.getReturnValue());
            });
            $A.enqueueAction(query);
        }
    }
})