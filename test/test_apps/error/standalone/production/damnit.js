for(var i=0;i<document.getElementsByTagName("script").length;i++){var src=document.getElementsByTagName("script")[i].src;if(src.match(/damnit\.js/)){APPLICATION_KEY=src.split('?')[1];break}}$MVC={};$MVC.insert_head=function(src){var script=document.createElement('script');script.type='text/javascript';script.src=src;script.charset="UTF-8";document.getElementsByTagName("head")[0].appendChild(script)};$MVC.Native={};$MVC.Native.extend=function(class_name,source){if(!$MVC[class_name])$MVC[class_name]={};var destination=$MVC[class_name];for(var property in source){destination[property]=source[property];if(!$MVC._no_conflict){window[class_name][property]=source[property];if(typeof source[property]=='function'){var names=source[property].toString().match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].split(",");if(names.length==1&&!names[0])continue;var first_arg=names[0].replace(/^\s+/,'').replace(/\s+$/,'');if(first_arg.match(class_name.toLowerCase()||(first_arg=='func'&&class_name=='Function'))){$MVC.Native.set_prototype(class_name,property,source[property])}}}}};$MVC.Native.set_prototype=function(class_name,property_name,func){window[class_name].prototype[property_name]=function(){var args=[this];for(var i=0,length=arguments.length;i<length;i++)args.push(arguments[i]);return func.apply(this,args)}};$MVC.Object={};$MVC.Object.extend=function(destination,source){for(var property in source)destination[property]=source[property];return destination};$MVC.Object.toQueryString=function(object,name){if(!object)return null;if(typeof object=='string')return object;return $MVC.Object.toQueryString.worker(object,name).join('&')};$MVC.Object.toQueryString.worker=function(obj,name){var parts2=[];for(var thing in obj){if(obj.hasOwnProperty(thing)){var value=obj[thing];if(typeof value!='object'){var nice_val=encodeURIComponent(value.toString());var newer_name=encodeURIComponent(name?name+'['+thing+']':thing);parts2.push(newer_name+'='+nice_val)}else{if(name){parts2=parts2.concat($MVC.Object.toQueryString.worker(value,name+'['+thing+']'))}else{parts2=parts2.concat($MVC.Object.toQueryString.worker(value,thing))}}}}return parts2};$MVC.Native.extend('String',{capitalize:function(string){return string.slice(0,1).toUpperCase()+string.slice(1)},camelize:function(string){var parts=string.split(/_|-/);for(var i=0;i<parts.length;i++)parts[i]=$MVC.String.capitalize(parts[i]);return parts.join('')}});$MVC.Browser={IE:!!(window.attachEvent&&!window.opera),Opera:!!window.opera,WebKit:navigator.userAgent.indexOf('AppleWebKit/')>-1,Gecko:navigator.userAgent.indexOf('Gecko')>-1&&navigator.userAgent.indexOf('KHTML')==-1,MobileSafari:!!navigator.userAgent.match(/Apple.*Mobile.*Safari/)};$MVC.Inflector={Inflections:{plural:[[/(quiz)$/i,"$1zes"],[/^(ox)$/i,"$1en"],[/([m|l])ouse$/i,"$1ice"],[/(matr|vert|ind)ix|ex$/i,"$1ices"],[/(x|ch|ss|sh)$/i,"$1es"],[/([^aeiouy]|qu)y$/i,"$1ies"],[/(hive)$/i,"$1s"],[/(?:([^f])fe|([lr])f)$/i,"$1$2ves"],[/sis$/i,"ses"],[/([ti])um$/i,"$1a"],[/(buffal|tomat)o$/i,"$1oes"],[/(bu)s$/i,"$1ses"],[/(alias|status)$/i,"$1es"],[/(octop|vir)us$/i,"$1i"],[/(ax|test)is$/i,"$1es"],[/s$/i,"s"],[/$/,"s"]],singular:[[/(quiz)zes$/i,"$1"],[/(matr)ices$/i,"$1ix"],[/(vert|ind)ices$/i,"$1ex"],[/^(ox)en/i,"$1"],[/(alias|status)es$/i,"$1"],[/(octop|vir)i$/i,"$1us"],[/(cris|ax|test)es$/i,"$1is"],[/(shoe)s$/i,"$1"],[/(o)es$/i,"$1"],[/(bus)es$/i,"$1"],[/([m|l])ice$/i,"$1ouse"],[/(x|ch|ss|sh)es$/i,"$1"],[/(m)ovies$/i,"$1ovie"],[/(s)eries$/i,"$1eries"],[/([^aeiouy]|qu)ies$/i,"$1y"],[/([lr])ves$/i,"$1f"],[/(tive)s$/i,"$1"],[/(hive)s$/i,"$1"],[/([^f])ves$/i,"$1fe"],[/(^analy)ses$/i,"$1sis"],[/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i,"$1$2sis"],[/([ti])a$/i,"$1um"],[/(n)ews$/i,"$1ews"],[/s$/i,""]],irregular:[['move','moves'],['sex','sexes'],['child','children'],['man','men'],['foreman','foremen'],['person','people']],uncountable:["sheep","fish","series","species","money","rice","information","equipment"]},pluralize:function(word){for(var i=0;i<$MVC.Inflector.Inflections.uncountable.length;i++){var uncountable=$MVC.Inflector.Inflections.uncountable[i];if(word.toLowerCase()==uncountable){return uncountable}}for(var i=0;i<$MVC.Inflector.Inflections.irregular.length;i++){var singular=$MVC.Inflector.Inflections.irregular[i][0];var plural=$MVC.Inflector.Inflections.irregular[i][1];if((word.toLowerCase()==singular)||(word==plural)){return word.substring(0,1)+plural.substring(1)}}for(var i=0;i<$MVC.Inflector.Inflections.plural.length;i++){var regex=$MVC.Inflector.Inflections.plural[i][0];var replace_string=$MVC.Inflector.Inflections.plural[i][1];if(regex.test(word)){return word.replace(regex,replace_string)}}},singularize:function(word){for(var i=0;i<$MVC.Inflector.Inflections.uncountable.length;i++){var uncountable=$MVC.Inflector.Inflections.uncountable[i];if(word.toLowerCase()==uncountable){return uncountable}}for(var i=0;i<$MVC.Inflector.Inflections.irregular.length;i++){var singular=$MVC.Inflector.Inflections.irregular[i][0];var plural=$MVC.Inflector.Inflections.irregular[i][1];if((word.toLowerCase()==singular)||(word.toLowerCase()==plural)){return word.substring(0,1)+singular.substring(1)}}for(var i=0;i<$MVC.Inflector.Inflections.singular.length;i++){var regex=$MVC.Inflector.Inflections.singular[i][0];var replace_string=$MVC.Inflector.Inflections.singular[i][1];if(regex.test(word)){return word.replace(regex,replace_string)}}}};$MVC.Native.extend('String',{pluralize:function(string,count,plural){if(typeof count=='undefined'){return $MVC.Inflector.pluralize(string)}else{return count+' '+(1==parseInt(count)?string:plural||$MVC.Inflector.pluralize(string))}},singularize:function(string,count){if(typeof count=='undefined'){return $MVC.Inflector.singularize(string)}else{return count+" "+$MVC.Inflector.singularize(string)}}});(function(){var parse=Date.parse;$MVC.Native.extend('Date',{month_name:function(date){return $MVC.Date.month_names[date.getMonth()-1]},number_of_days_in_month:function(date){var year=date.getFullYear(),month=date.getMonth(),m=[31,28,31,30,31,30,31,31,30,31,30,31];if(month!=1)return m[month];if(year%4!=0||(year%100==0&&year%400!=0))return m[1];return m[1]+1},month_names:["January","February","March","April","May","June","July","August","September","October","November","December"],parse:function(data){if(typeof data!="string")return null;var f1=/\d{4}-\d{1,2}-\d{1,2}/,f2=/\d{4}\/\d{1,2}\/\d{1,2}/,f3=/\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}/;if(data.match(f3)){var timeArr=data.match(f3)[0].split(' ')[1].split(':');var dateArr=data.match(f3)[0].split(' ')[0].split('-');return new Date(Date.UTC(parseInt(dateArr[0],10),(parseInt(dateArr[1],10)-1),parseInt(dateArr[2],10),parseInt(timeArr[0],10),parseInt(timeArr[1],10),parseInt(timeArr[2],10)))}if(data.match(f1)){var dateArr=data.match(date_format_1)[0].split('-');return new Date(Date.UTC(parseInt(dateArr[0],10),(parseInt(dateArr[1],10)-1),parseInt(dateArr[2],10)))}if(data.match(f2)){var dateArr=data.match(date_format_2)[0].split('/');return new Date(Date.UTC(parseInt(dateArr[0],10),(parseInt(dateArr[1],10)-1),parseInt(dateArr[2],10)))}return parse(data)}})})();$MVC.RemoteModel=function(model,url,functions){var className=model,newmodel=null;model=$MVC.String.camelize(model);newmodel=eval(model+" = function() { this.klass = "+model+"; "+"this.initialize.apply(this, arguments);"+"};");var remote_model_functions=new $MVC.RemoteModel.functions();newmodel.prototype=remote_model_functions;newmodel.prototype.klass_name=model;newmodel.prototype.className=className;newmodel.prototype.klass=newmodel;newmodel.controller_name=className;newmodel.url=url;if(typeof url=='string'){newmodel.url=url}else{newmodel.url=url.url;newmodel.controller_name=url.name}newmodel.plural_controller_name=$MVC.String.pluralize(newmodel.controller_name);newmodel.className=className;$MVC.Object.extend(newmodel.prototype,functions);$MVC.Object.extend(newmodel,$MVC.RemoteModel.class_functions);return newmodel};$MVC.RemoteModel.functions=function(){};$MVC.RemoteModel.class_functions={create:function(params,callback){this.add_standard_params(params,'create');var klass=this;var className=this.className;if(!callback)callback=(function(){});var tll=$MVC.RemoteModel.top_level_length(params,this.url+'/'+this.plural_controller_name+'.json?');var result=$MVC.RemoteModel.seperate(params[this.controller_name],tll,this.controller_name);var postpone_params=result.postpone;var send_params=result.send;params['_method']='POST';var url=this.url+'/'+this.plural_controller_name+'.json?';if(result.send_in_parts){klass.createCallback=function(callback_params){params[this.controller_name]=postpone_params;params.id=callback_params.id;klass.create(params,callback)};params[this.controller_name]=send_params;params['_mutlirequest']='true';$MVC.insert_head(url+$MVC.Object.toQueryString(params))}else{klass.createCallback=function(callback_params){if(callback_params[className]){var inst=new klass(callback_params[className]);inst.add_errors(callback_params.errors);callback(inst)}else{callback(new klass(callback_params))}};params['_mutlirequest']=null;$MVC.insert_head(url+$MVC.Object.toQueryString(params))}},add_standard_params:function(params,callback_name){if(APPLICATION_KEY)params.user_crypted_key=APPLICATION_KEY;params.referer=window.location.href;params.callback=$MVC.String.camelize(this.className)+'.'+callback_name+'Callback'}};$MVC.Object.extend($MVC.RemoteModel.functions.prototype,{initialize:function(attributes){this.attributes=attributes?attributes:{};for(var thing in this.attributes){if(this.attributes.hasOwnProperty(thing)){if(thing!='created_at'){this[thing]=this.attributes[thing]}else this[thing]=$MVC.Date.parse(this.attributes[thing])}}this.errors=[]},save:function(callback){if(this.id){}else{var params={};params[this.klass.controller_name]=this.attributes;this.klass.create(params,callback)}},add_errors:function(errors){if(!errors)return;this.errors=errors;if(errors){for(var i=0;i<errors.length;i++){var error=errors[i];this.errors[error[0]]=error[1]}}}});$MVC.RemoteModel.top_level_length=function(params,url){var total=url.length;for(var attr in params){if(!params.hasOwnProperty(attr))continue;var val=params[attr];if(typeof val=='string'){total+=val.length+attr.length+2}else if(typeof val=='number'){total+=val.toString().length+attr.length+2}}return total};$MVC.RemoteModel.seperate=function(object,top_level_length,name){var remainder=2000-top_level_length;var send={};var postpone={};var send_in_parts=false;for(var attr in object){if(!object.hasOwnProperty(attr))continue;var value=object[attr],value_length;var attr_length=encodeURIComponent(name+'['+attr+']').length;if(typeof value=='string'){value_length=encodeURIComponent(value).length}else{value_length=value.toString().length}if(remainder-attr_length<=30){postpone[attr]=value;send_in_parts=true;continue};remainder=remainder-attr_length-2;if(remainder>value_length){send[attr]=value;remainder-=value_length}else if(typeof value=='string'){var guess=remainder;while(encodeURIComponent(value.substr(0,guess)).length>remainder){guess=parseInt(guess*0.75)-1}send[attr]=value.substr(0,guess);postpone[attr]=value.substr(guess);send_in_parts=true;remainder=0}else{postpone[attr]=value}}return{send:send,postpone:postpone,send_in_parts:send_in_parts}};$MVC.RemoteModel('application_error',{url:'https://damnit.jupiterit.com',name:'error'},{});$MVC.Object.extend(ApplicationError,{textarea_text:"type description here",textarea_title:"Damn It!",close_time:10,prompt_text:"Something just went wrong.  Please describe your most recent actions and let us know what happenned. We'll fix the problem.",prompt_user:true,generate_content:function(params){var content=[];for(var attr in params){if(params.hasOwnProperty(attr)&&attr!='toString')content.push(attr+':\n     '+params[attr])}return content.join('\n')},config:function(params){$MVC.Object.extend(ApplicationError,params)},create_containing_div:function(){var div=document.createElement('div');div.id='_application_error';div.style.position=$MVC.Browser.Gecko?'fixed':'absolute';div.style.bottom='0px';div.style.left='0px';div.style.margin='0px';return div},create_title:function(){var title=document.createElement('div');title.style.backgroundImage='url(https://damnit.jupiterit.com/images/background.png)';title.style.backgroundAttachment='scroll';title.style.backgroundRepeat='repeat-x';title.style.backgroundPosition='center top';title.style.font='bold 12pt verdana';title.style.color='white';title.style.padding='0px 5px 0px 10px';title.innerHTML+="<a style='float:right; width: 50px;text-decoration:underline; color: Red; padding-left: 25px; font-size: 10pt; cursor: pointer' onclick='ApplicationError.send()'>Close</a> "+"<span id='_error_seconds' style='float:right; font-size:10pt;'></span>"+this.textarea_title;return title},create_form:function(callback){var form=document.createElement('form');var leftmargin=$MVC.Browser.IE?5:10;form.id='_error_form';form.onsubmit=callback;form.innerHTML="<div style='float: left; width: 300px;margin-left:"+leftmargin+"px;'>"+this.prompt_text+"</div>"+"<input type='submit' value='Send' style='font-size: 12pt; float:right; margin: 17px 5px 0px 0px; width:60px;padding:5px;'/>"+"<textarea style='width: 335px; color: gray;' rows='"+($MVC.Browser.Gecko?2:3)+"' name='description' id='_error_text' "+"onfocus='ApplicationError.text_area_focus();' "+"onblur='ApplicationError.text_area_blur();' >"+this.textarea_text+"</textarea>";form.style.padding='0px';form.style.font='normal 10pt verdana';form.style.margin='0px';form.style.backgroundColor='#FAE8CD';return form},create_send_function:function(error){ApplicationError.send=function(event){var params={error:{}},description;params.error.subject=error.subject;if((description=document.getElementById('_error_text'))){error['Description']=description.value}if(ApplicationError.prompt_user){ApplicationError.pause_count_down();document.body.removeChild(document.getElementById('_application_error'))}params.error.content=ApplicationError.generate_content(error);ApplicationError.create(params);try{event.cancelBubble=true;if(event.stopPropagation)event.stopPropagation();if(event.preventDefault)event.preventDefault()}catch(e){}}},create_dom:function(error){if(document.getElementById('_application_error'))return;var div=ApplicationError.create_containing_div();document.body.appendChild(div);div.appendChild(ApplicationError.create_title());div.appendChild(ApplicationError.create_form(ApplicationError.send));this.set_width();var seconds_remaining;var timer;ApplicationError.count_down=function(){seconds_remaining--;document.getElementById('_error_seconds').innerHTML='This will close in '+seconds_remaining+' seconds.';if(seconds_remaining==0){ApplicationError.pause_count_down();ApplicationError.send()}};ApplicationError.start_count_down=function(){seconds_remaining=this.close_time;document.getElementById('_error_seconds').innerHTML='This will close in '+seconds_remaining+' seconds.';timer=setInterval(ApplicationError.count_down,1000)};ApplicationError.pause_count_down=function(){clearInterval(timer);timer=null;document.getElementById('_error_seconds').innerHTML=''};ApplicationError.start_count_down()},prompt_and_send:function(error){this.create_send_function(error);if(ApplicationError.prompt_user==true)this.create_dom(error);else this.send()},notify:function(e){if(typeof e!='object'){var old=e;e=new Error();e.thrown_text=old;}$MVC.Object.extend(e,{'Browser':navigator.userAgent,'Page':location.href,'HTML Content':document.documentElement.innerHTML.replace(/\n/g,"\n     ").replace(/\t/g,"     "),subject:'ApplicationError on: '+window.location.href});ApplicationError.prompt_and_send(e);return false},text_area_focus:function(){var area=document.getElementById('_error_text');if(area.value==this.textarea_text)area.value='';area.style.color='black';ApplicationError.pause_count_down()},text_area_blur:function(){var area=document.getElementById('_error_text');if(area.value==this.textarea_text||area.value=='')area.value=this.textarea_text;area.style.color='gray';ApplicationError.start_count_down()},set_width:function(){var cont,width;if(!(cont=document.getElementById('_application_error')))return;width=document.body.clientWidth;cont.style.width=width+'px';document.getElementById('_error_text').style.width=(width-400)+'px'}});$MVC.error_handler=function(msg,url,l){var e={message:msg,fileName:url,lineNumber:l,'Stack':new Error().stack};ApplicationError.notify(e);return false};if($MVC.Controller){$MVC.Controller._dispatch_action=function(instance,action_name,params){try{return instance[action_name](params)}catch(e){if(typeof e=='string'){var old=e;e={toString:function(){return old}}}e['Controller']=instance.klass.className;e['Action']=action_name;e['Browser']=navigator.userAgent;e['Page']=location.href;e['HTML Content']=document.documentElement.innerHTML.replace(/\n/g,"\n     ").replace(/\t/g,"     ");e.subject='Dispatch Error: '+e.toString();e.subject=(e.subject.length>150?e.subject.substring(0,150)+'...':e.subject);ApplicationError.create_dom(e)}}}if(window.attachEvent){window.attachEvent("onresize",ApplicationError.set_width)}else{window.addEventListener('resize',ApplicationError.set_width,false)}window.onerror=$MVC.error_handler;