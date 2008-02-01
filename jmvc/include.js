/***
 * Include
 * 	Include adds other JavaScript files, and can be used to compress a project.
 * 
 */


(function(){
	//checks if included has been added, if it has, gets the next included file.
	if(typeof include != 'undefined'){
		include.end();
		return;
	}
	//Saves root of the page that include is loaded on;
	var PAGE_ROOT = window.location.href;
	var last = PAGE_ROOT.lastIndexOf('/');
	if(last != -1) PAGE_ROOT = PAGE_ROOT.substring(0,last+1);
	
	
	var INCLUDE_ROOT = '',INCLUDE_PATH = '', first = true , INCLUDE_regex = /include\.js/;
	var env = 'development', production = '/javascripts/production.js', cwd = '', includes=[], current_includes=[];
	var total = []; //used to store text
	
	//returns true if a path is absolute
	var is_absolute = function(path){
		return path.indexOf('/') == 0 || path.indexOf('http') == 0 || path.indexOf('file://') == 0
	}
	
	//joins 2 folders.  This takes into account things like ../../
	var join = function(first, second){
		var first_parts = first.split('/');
		first_parts.pop();
		var second_parts = second.split('/');
		var second_part = second_parts[0];
		while(second_part == '..' && second_parts.length > 0){
			second_parts.shift();
			first_parts.pop();
			second_part =second_parts[0];
		}
		return first_parts.concat(second_parts).join('/');
	}
	//find include and get its absolute path
	for(var i=0; i<document.getElementsByTagName("script").length; i++) {
		var src = document.getElementsByTagName("script")[i].src;
		if(src.match(INCLUDE_regex)){
			INCLUDE_PATH = src;
			if(!is_absolute(src) ) src = join(window.location.href, src);
			INCLUDE_ROOT = src.replace(INCLUDE_regex,'');
		}
			
	}
	/**
	 * includes a list of files like 'abc','def'
	 */
	include = function(){
		if(include.get_env()=='development' || include.get_env()=='compress'){
			for(var i=0; i < arguments.length; i++){
				include.add(arguments[i]);
			}
		}else{
			if(!first) return;
			document.write('<script type="text/javascript" src="'+include.get_path()+include.get_production_name()+'"></script>');
			first = false;
			return;
		}
		if(first && !navigator.userAgent.match(/Opera/)){
			first = false;
			insert(); //insert include tag
		}
	};
	
	
	/**
	 * Sets up the environment.
	 * @param {Object} environment - the environment the scripts are running in [deveopment,compress,production]
	 * @param {Object} production_name - where the production file should be looked for
	 */
	include.setup = function(environment, production_name){
		if(environment != 'development' && environment != 'production' && environment != 'compress'){
			alert('You are using an incorrect environment!  Only development, production, and compress are allowed.');
			return;
		}
		
		env = environment;
		if(production_name)   production = production_name+(production_name.indexOf('.js') == -1 ? '.js' : '' );
		
		if(env == 'compress') document.write('<script type="text/javascript" src="'+INCLUDE_ROOT+'compress.js'+'"></script>');
		
	};
	
	include.get_env = function() { return env;}
	include.get_production_name = function() { return production;}
	include.set_path = function(p) { cwd = p;}
	include.get_path = function() { return cwd;}
	
	include.get_absolute_path = function(){
		if(is_absolute(cwd)) return cwd;
		return join(PAGE_ROOT,cwd);
	}
	
	
	
	/**
	 * Adds a file to the of objects to be included.  If it is not absolute, it adds the current path
	 * to the include path.
	 * @param {Object} name
	 */
	include.add = function(name){
		if(first_wave_done){ //add right away!
			insert_head(name);
			return;
		}
		
		name = ( name.indexOf('.js') == -1 ? name+'.js' : name );
		var ar = name.split('/');
		ar.pop();
		var newer_path = ar.join('/');
		var current_path = include.get_path()
		//set the path to the new object;
		if(current_path != '' && !is_absolute(name) ){
			newer_path = current_path+'/'+ newer_path;
			name = current_path+'/'+name;
		}
		current_includes.unshift(  {start: newer_path, name: name } );
	}
	var first_wave_done = false; 
	/**
	 * called after a file is loaded.  Then it takes the last one
	 * and loads it.  If it is the last one and it is in compression
	 * opens the compression page
	 */
	include.end = function(){
		includes = includes.concat(current_includes);
		var latest = includes.pop();
		
		if(!latest) {
			first_wave_done = true;
			if(include.get_env()=='compress'){
				include.total = total;
				if(! document.getElementById('_COMPRESS')){
					var div = document.createElement('div');
					div.id = '_COMPRESS';
					var s = div.style
					s.zIndex = '999';
					s.border = 'solid 1px Green'
					s.position = 'absolute';
					s.left = '10px';
					s.width = '700px';
					s.top = '10px';
					div.innerHTML = 'Compressing';
					s.backgroundColor = '#dddddd';
					document.body.appendChild(div);
				}
				setTimeout( include.compress, 10 );
			}
			return;
		};
		current_includes = [];
		include.set_path(latest.start);
		insert(latest.name);

	}
	/**
	 * This is for opera.  Call after all your includes.
	 */
	include.opera = function(){
		if(navigator.userAgent.match(/Opera/)){
			include.end();
		}
	}
	include.srcs = [];
	var insert_head = function(src){
		var script= document.createElement("script");
		script.type= "text/javascript";
		script.src= src;
		script.charset= "UTF-8";
		document.getElementsByTagName("head")[0].appendChild(script);
	}
	
	var insert = function(src){
		//if you are compressing, load, eval, and then call end and return.
		if(src && include.get_env()=='compress'){
			var text = JMVC.request(src);
			total.push( text);
			include.srcs.push(src);
		}
		
		
		if(navigator.userAgent.match(/Safari/) ){
			var start = script_tag();
			start.src = INCLUDE_PATH+'?'+Math.random()
			document.body.appendChild(start)
	
			if(!src) return ;
			var script = script_tag();
			script.src=src+'?'+Math.random()
			document.body.appendChild(script)
	
		}else if(navigator.userAgent.match(/Opera/)){
			if(src) {
				var script = script_tag();
				script.src=src+'?'+Math.random()
				document.body.appendChild(script)
			}
			var start = script_tag();
			start.src = INCLUDE_PATH+'?'+Math.random()
			document.body.appendChild(start)
		}
		else
		{
			//alert((src? '<script type="text/javascript" src="'+src+(true ? '': '?'+Math.random() )+'"></script>':'')+
			//	'<script type="text/javascript" src="'+INCLUDE_PATH+(navigator.userAgent.match(/Firefox/) ? '': '?'+Math.random() )+'"></script>')
			document.write(
				(src? '<script type="text/javascript" src="'+src+(true ? '': '?'+Math.random() )+'"></script>':'')+
				'<script type="text/javascript" src="'+INCLUDE_PATH+(navigator.userAgent.match(/Firefox/) ? '': '?'+Math.random() )+'"></script>'
			);
		}
	}
	var script_tag = function(){
		var start = document.createElement('script');
		start.type = 'text/javascript';
		return start;
	}
})();