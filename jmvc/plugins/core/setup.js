include.plugins('debug');

if(typeof Prototype == 'undefined') {
	include({path: '../helpers/standard_helpers.js', shrink_variables: false},
			"../inflector/inflector",
			"../event/standard",
			"../ajax/ajax",
			"../class2/setup");
}else{
	MVC.Event = Event;
	include({path: '../helpers/prototype_helpers.js', shrink_variables: false},
			"../inflector/inflector",
			"../ajax/prototype_ajax");
}
include('../ajax/debug');

if(include.get_env() == 'test') include('test')

include('../view/view', 
		'../controller/controller',
		'../controller/delegator',
		'../controller_view/controller_view');
		
if(include.get_env() == 'development')	include('../view/fulljslint');

if(include.get_env() == 'test')
	include('../controller/test');

