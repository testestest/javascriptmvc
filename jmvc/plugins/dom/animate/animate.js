/**
 * @constructor
 * Provides simple animation functionality for JavaScriptMVC.
 * @init
 * Starts a new animation.
 * @param {HTMLElement|String} element the element to animation
 * @param {Object} params css properties to change and their value
 * @param {Nuber} duration how long the animation should take place in milliseconds
 * @param {optional:Object} easing function for the object's motion.
 * @param {optional:Function} callback calls when animation has completed
 */
MVC.Animate = function(element, params, duration, easing, callback){
    element = MVC.$E(element);
    callback = callback || function(){}
    //get starting values.
    var starting_values = {};
    var val;
    for(var param in params){
        val = params[param];
        starting_values[param] = new MVC.Animate.Value(element,param, val);
        //this.get_starting_value( MVC.Element.get_style( element, param ) );
    }
    
    this.timer = new MVC.Timer({from: 0, to: 1, time: duration,
        onUpdate : function(percentage){
            for(var param in starting_values){
                element.style[param] = starting_values[param].get(percentage);
            }
        },
        onComplete : function(){
            for(var param in starting_values){
                element.style[param] = starting_values[param].last();
            }
            callback(element);
        }
    });
    this.timer.start();
    
}

MVC.Animate.
/**
 * 
 */
is_color = function(style){
   var matches; 
   if( (matches = style.toString().match(/#(\w\w)(\w\w)(\w\w)/))    ){
       return new MVC.Vector(parseInt(matches[1],16) , parseInt(matches[2],16) ,parseInt(matches[3],16) )
   }else if((matches = style.toString().match(/rgb\(\s*(\w+)\s*,\s*(\w+)\s*,\s*(\w+)\s*\)/i)) ){
       return new MVC.Vector(parseInt(matches[1],10) , parseInt(matches[2],10) ,parseInt(matches[3],10) )
   }
   return null;
}
MVC.Animate.
get_vector = function(style){
     var is_color = MVC.Animate.is_color(style);
     return is_color ? is_color : new MVC.Vector(  parseFloat( style ) || 0   )
}

MVC.Animate.exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i
MVC.Animate.Value = function(element, style, end){
    this.style = style;
    this.start_style = MVC.Element.get_style( element, style )
    this.vector_start =  MVC.Animate.is_color(this.start_style)
    this.start = parseFloat(this.start_style ) || 0;
    var parts = end.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/);
    
    if ( parts ) {
        this.end = parseFloat(parts[2]);
        this.unit = parts[3] || (MVC.Animate.exclude.test(style) ? "" : "px");
        if ( this.unit != "px" ) {
				element.style[ style ] = (end || 1) + this.unit;
				this.start = ((end || 1) / MVC.Element.get_style( element, style )) * this.start;
				element.style[ style ] = this.start + this.unit;
		}
        if ( parts[1] )
			this.end = ((parts[1] == "-=" ? -1 : 1) * this.end) + this.start;
        
    }else{
        this.vector_end = MVC.Animate.is_color(end);
        this.end = end;
        this.unit =  MVC.Animate.exclude.test(style) ? "" : "px";
    }
    if(this.vector_start)
        this.vector_distance = this.vector_end.minus(this.vector_start)
    this.distance = this.end - this.start;
}

MVC.Animate.Value.prototype = {
    get: function(percent){
        if(this.vector_start){
            var nv = this.vector_start.plus( 
                this.vector_distance.app(
                    function(d){ 
                        return percent*d 
                    }) 
                );
            return "rgb("+ parseInt(nv[0]) +","+ parseInt( nv[1] )+","+ parseInt( nv[2] )+")";
            
        }else{
            return (this.start+percent*this.distance)+this.unit;
        }  
    },
    last: function(){
        return this.vector_start ?  
            "rgb("+ parseInt( this.vector_end[0] )+
               ","+ parseInt(this.vector_end[1] )+ 
               ","+ parseInt( this.vector_end[2] )+")"   : 
            (this.end)+this.unit;
    }
}