({
	doInit : function(component, event, helper) {

	var self=this;  //let's be clear on what THIS is

	//three apex calls we'll be using
	var getRecords = component.get("c.query");
	var updateCall = component.get("c.updateField");
	var getOptions = component.get("c.getPicklistOptions");        

	helper.buildSoql(component);
	helper.buildDisplayFieldsArray(component);

	getRecords.setParams({"soql" : component.get("v.soql")});

	getRecords.setCallback(self, function(a){        	

		//deal with the records that came back, organize by the pathField
		var records = JSON.parse(a.getReturnValue());
		var DFA = component.get("v.displayFieldsArray")
		
		//set the display fields on the records
		_.forEach(records, function(value, key){
			records[key].displayFields = [];
			_.forEach(DFA, function(DFAvalue, DFAkey){
				if (DFAvalue.indexOf(".")>0){
					var splitDFA = DFAvalue.split(".");
					//handling relationship queries
					records[key].displayFields.push(records[key][splitDFA[0]][splitDFA[1]]);
				} else {
					//simple fields
					records[key].displayFields.push(records[key][DFAvalue]);            		            			
				}
			})
		});

		//console.log(records);

		var tree = component.get("v.options");
		var grouped = _.groupBy(records, component.get("v.pathField"));
		
		//console.log(grouped);

		_.forEach(tree, function(value, key) {
			//console.log(value.name);
			tree[key].records = grouped[value.name];
		});

		//console.log(tree);
		component.set("v.options", tree);

		//only execute if drag-->change is allowed
		if (component.get("v.dragToChange")){
			//take the <ul> and make them into Dragula containers
			// AND set the target function
			var DBs = [].slice.call(document.querySelectorAll(".dragulaBox"));
			dragula(DBs, {
				revertOnSpill: true
			}).on("drop", $A.getCallback(function (el, target, source){
				//console.log("getting dropped");
				//console.log(source);
				//console.log(el);


				//public static boolean updateField(id recordId, string Field, string newValue){            	
					updateCall.setParams({
						"recordId" : el.id,
						"Field" : component.get("v.pathField"),
						"newValue" : target.id
					});
					updateCall.setCallback(self, function(a){
						if (a.getState() === "SUCCESS") {       
							var toastEvent = $A.get("e.force:showToast");                 
							toastEvent.setParams({
								"title": "Success:",
								"message": 'Record Updated to ' + target.id,
								"type": "success"
							});
							toastEvent.fire();
						} else if (a.getState() === "ERROR"){
							//dragula.cancel();
							//console.log(a.getReturnValue());
							var parent = document.getElementById(target.id);
							var child = document.getElementById(el.id);
							parent.removeChild(child);
							var newParent = document.getElementById(source.id);
							newParent.appendChild(child);

							var errors = a.getError();
							//console.log(errors)
							if (errors) {
								//iterate the errors!
								//TODO: duplicate rules errors ?
								_.forEach(errors[0].pageErrors, function(value, key){
									var toastEvent = $A.get("e.force:showToast");
									toastEvent.setParams({
										"title": "Error:",
										"message": value.message,
										"type": "error",
										"mode": "dismissible"
									});
									toastEvent.fire();
								});
								_.forEach(errors[0].fieldErrors, function(value, key){
									var toastEvent = $A.get("e.force:showToast");
									toastEvent.setParams({
										"title": "Field Error on " + key + " : ",
										"message": value[0].message,
										"type": "error",
										"mode": "dismissible"
									});
									toastEvent.fire();
								});
							}
						}
					});


					if (component.isValid()){
						$A.enqueueAction(updateCall)
					}
				}));            	
		}
	});

	var params = {
		"recordId" : component.get("v.recordId"),
		"picklistField" : component.get("v.pathField"),
		"sObjectName" : component.get("v.sObjectName")            
	};

	getOptions.setParams(params);

	getOptions.setCallback(self, function(a){
		var rawOptions = a.getReturnValue();
		helper.buildEmptyTree(component, rawOptions);
		$A.enqueueAction(getRecords);	            
	});

	$A.enqueueAction(getOptions);        

},

navToRecord : function(component, event){
	//console.log("nav invoked, get id first");

	var recordId = event.target.value;
	//console.log(recordId);

	var navEvt = $A.get("e.force:navigateToSObject");
	navEvt.setParams({
		"recordId": recordId
	});
	navEvt.fire();
}


})