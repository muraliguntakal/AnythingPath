Adds sales-path like visualization to any custom object, where the stages are a picklist field.

Does

* show the stages, in the order of the picklist
* work on standard or custom objects
* have an option to let you change the value by clicking on a stage
* let you change the picklist field in App Builder/Community Builder
* work in Community Templates (Napili, etc) but you have to also tell it which object (Something__c)
* have a whole bunch of use within Salesforce

Doesn't

* verify that it's actually a picklist field
* verify that it's actually a field at all :)
* deal with record types where only some picklist values are there
* have the fields or "guidance for success" stuff that real sales path has
* have any error handling (if you change to a value that's throwing an exception due to triggers or validation rules, you see NOTHING!)
* come with any guarantees from Salesforce or support from me.  Treat this as code you found laying beside the road.