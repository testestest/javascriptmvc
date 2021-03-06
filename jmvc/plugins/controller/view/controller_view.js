/**
 * @add MVC.Controller Prototype
 */

jQuery.Controller.prototype.
/**
 * Renders a View template with the controller instance. If action or partial 
 * are not supplied in the options, 
 * it looks for a view in app/views/controller_name/action_name.ejs
 * 
 * @code_start
 * TasksController = MVC.Controller.extend('tasks',{
 *   click : function(params){
 *     this.data = "Hello_world"                             // can display with &lt;%= data %>
 *     this.render({after: params.element, action: "under"}) // renders with views/tasks/under.ejs
 *     this.render({to: "element_id"})                       // renders with views/tasks/click.ejs
 *     this.render({top: "another_e", partial: "bee/sugar")) // renders with views/bee/_sugar.ejs
 *   }
 * })
 * @code_end
 * @plugin controller/view
 * @return {String} the result of the render.
 * @param {Object} options A hash with the following properties
 * <table class="options">
					<tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
					<tr>
						<td>action</td>
						<td>null</td>
						<td>If present, looks for a template in app/views/<i>controller_name</i>/<i>action</i>.ejs
						</td>
					</tr>
					<tr>
						<td>partial</td>
						<td>null</td>
						<td>A string value that looks like: 'folder/template' or 'template'.  If a folder is present,
						    it looks for a template in app/views/<i>folder</i>/_<i>template</i>.ejs; otherwise,
							it looks for a template in app/views/<i>controller_name</i>/_<i>template</i>.ejs.
						</td>
					</tr>
					<tr>
						<td>to</td>
						<td>null</td>
						<td>If present, a HTMLElement or element ID whose text will be replaced by the render.
						</td>
					</tr>
					<tr>
						<td>before, after, top, bottom</td>
						<td>null</td>
						<td>If present, the content will be placed relative to 
						the HTMLElement or element ID.
						</td>
					</tr>
					<tr>
						<td>text</td>
						<td>null</td>
						<td>Instead of using a view to generate text, it uses the text as the rendered text.
						</td>
					</tr>
					<tr>
						<td>using</td>
						<td>null</td>
						<td>If present, renders with the data in using instead of the controller instance.  This is important for
						stateful controllers.
						</td>
					</tr>
				</tbody></table>
	 
 */
render = function(options) {
		var result, render_to_id = MVC.RENDER_TO, plugin_url;
		var controller_name = this.Class.className;
		var action_name = this.action_name;
        if(!options) options = {};
        
        var helpers = {};
        if(options.helpers){
            for(var h =0; h < options.helpers.length; h++){
                var n = MVC.String.classize( options.helpers[h] );
                jQuery.extend(helpers, window[n] ? window[n].View().helpers : {} );
            }
        }
        
		if(typeof options == 'string'){
			result = new MVC.View({view:  options  }).render(this, helpers);
		}
		else if(options.text) {
            result = options.text;
        }
        else {
            var convert = function(url){
				var url =  MVC.String.include(url,'/') ? url.split('/').join('/_') : controller_name+'/'+url;
				var url = url + MVC.View.ext;
				return url;
			};
			if(options.plugin){
                plugin_url = '../jmvc/plugins/'+options.plugin;
            }
            
			if(options.action) {
				var url = '../views/'+convert(options.action);
            }
			else if(options.partial) {
                var url = '../views/'+convert(options.partial);
			}else
            {
                var url = '../views/'+controller_name+'/'+action_name.replace(/\.|#/g, '').replace(/ /g,'_')+MVC.View.ext;
            }
			var data_to_render = options.using || this;
			if(options.locals) {
				for(var local_var in options.locals) {
					data_to_render[local_var] = options.locals[local_var];
				}
			}
            var view;
            if(!plugin_url){
                view = new MVC.View({view:  new MVC.File(url).join_from(this.Class._path)  }); //what about controllers in other folders?
            }else{
                //load plugin if it has been included
                try{
                    var view = new MVC.View({view:  MVC.View.get(plugin_url) ? plugin_url :  url  });
                }catch(e){
                    if(e.type !='JMVC') throw e;
                    var view = new MVC.View({view:  plugin_url  });
                }
            }
            result = view.render(data_to_render, helpers);
		}
		
		var locations = [{
			name: 'to',
			action: function(destination, content) {
				destination.html(content);
			}
		}, {
			name: 'before',
			action: function(destination, content) {
				destination.before(content);
			}
		}, {
			name: 'after',
			action: function(destination, content) {
				destination.after(content);
			}
		}, {
			name: 'top',
			action: function(destination, content) {
				destination.prepend(content);
			}
		}, {
			name: 'bottom',
			action: function(destination, content) {
				destination.append(content);
			}
		}, {
			name: 'replace',
			action: function(destination, content) {
				destination.replaceWith(content);
			}
		}];
		
		var location;
		var destination;
		var l = 0;
		
		do {
			location = locations[l];
			destination = options[location.name];
			l++;
		} while((l < locations.length) && !destination);
		
		if (!destination) {
			location = locations[0];	// default to "to"
			destination = controller_name;
		}

		var option_location_is_an_id = typeof destination == 'string';
		destination = $(option_location_is_an_id ? '#' + destination : destination);
	
		if (destination.length == 0)
			// is it necessary to throw an exception here or can we silently continue?
			throw { 
				message: option_location_is_an_id
					? "Can't find any element with id: " + destination.selector
					: "Can't find HTMLElement",
				name: 'ControllerView: Missing Element'
			};

		location.action(destination, result);
		
		return result;
};