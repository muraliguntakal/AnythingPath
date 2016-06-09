**Adds sales-path like visualization to any custom object, where the stages are a picklist field.**

Now includes AnythingBoard (kanban-like drag and drop for custom object status).

Tongue-in-cheek [demo video](https://www.youtube.com/watch?v=Zoqll5THApU) that was done for internal Salesforce humor.


##AnythingPath

###Does

* show the stages, in the order of the picklist
* work on standard or custom objects
* have an option to let you change the value by clicking on a stage
* let you change the picklist field in App Builder/Community Builder
* work in Community Templates (Napili, etc) but you have to also tell it which object (Something__c)
* have a whole bunch of use within Salesforce
* display errors, including validation rule errors
* update the path if you do "edit" on the record detail (except in communities, where there's no streaming API)

###Doesn't

* verify that it's actually a picklist field
* verify that it's actually a field at all :)
* deal with record types where only some picklist values are there
* have the fields or "guidance for success" stuff that real sales path has
* come with any guarantees from Salesforce or support from me.  Treat this as code you found laying beside the road.

##AnythingBoard
###Does

* show the stags, in the order of the picklist
* work on standard or custom objects
* show as many fields as you like

###Doesn't

* do any rollup/count/sum of any fields
* verify that it's actually a picklist field
* verify that it's actually a field at all :)
* deal with record types where only some picklist values are there
* have any error handling (if you change to a value that's throwing an exception due to triggers or validation rules, you see NOTHING!)
* come with any guarantees from Salesforce or support from me.  Treat this as code you found laying beside the road.