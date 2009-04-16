jQuery.Controller.Action.extend("jQuery.Controller.Action.Respond",
{},
{

	/**
	 * basically set callbacks up, and add element to list of elements
	 * what if you wanted to have multiple drop points -> work that out later?
	 * 
	 */
	init : function(action_name, callback, className, element){
		this._super(action_name, callback, className, element)
        this.css_and_event();
        var selector = this.selector();
		var drop_callbacks = jQuery.data(this.element,"drop_callbacks", jQuery.data(this.element,"drop_callbacks") || {} );

		if(!drop_callbacks[selector]) drop_callbacks[selector] = {};
		drop_callbacks[selector][this.event_type] = callback; // should probably be an array
		jQuery[this.Class.className].addElement(element);
	},
	destroy : function(){
		jQuery[this.Class.className].removeElement(this.element);
		var drop_callbacks = jQuery.removeData(this.element,"drop_callbacks");
		delete drop_callbacks[this.selector()];
		this._super();
	}
});





//===========================================

jQuery.Class.extend('jQuery.Respond',
/* @Class */
{
    init : function(){
		jQuery.Move.responder = this;  
		this._elements = [];
		this._responders = [];
		this.lowerName = this.className.toLowerCase();
		this.endName = this.lowerName+"ed";
    },
    addElement : function(el){
        //check other elements
        for(var i =0; i < this._elements.length ; i++  ){
            if(el ==this._elements[i]) return;
        }
        this._elements.push(el);
    },
    removeElement : function(el){
         for(var i =0; i < this._elements.length ; i++  ){
            if(el == this._elements[i]){
                this._elements.splice(i,1)
                return;
            }
        }
    },
	/**
	 * Creates a new droppable and adds it to the list.
	 * @param {Object} element
	 * @param {Object} callbacks - callback functions for drop events
	 */
	add: function(element, callbacks, event) {
		element = jQuery(element);
        
		var responder = new this(callbacks, element);
		
        if(responder[this.lowerName+'add']) responder[this.lowerName+'add'](element, event, responder);
		
        if(!responder._canceled){
		    this._responders.push(responder);
		}
	    
	},
	/**
	* For a list of affected drops, finds the one that is deepest in
	* the dom.
	*/ 
	findDeepestChild: function(responders) {
		//return right away if there are no drops
		
        if(responders.length == 0) return null;
		var deepest = responders[0];

		for (i = 1; i < responders.length; ++i)
		  if (responders[i].element.compare( deepest.element) & 16 )
		    deepest = responders[i];
		
		return deepest;
	},
	/**
	 * Tests if a drop is within the point.
	 */
	isAffected: function(point, element, responder) {
        return (
		  (responder.element!=element) && responder.element.within(point[0], point[1], responder).length == 1 ) ;
	},
	/**
	 * Calls dropout and sets last active to null
	 * @param {Object} drop
	 * @param {Object} drag
	 * @param {Object} event
	 */
	deactivate: function(responder, mover, event) {
		this.last_active = null;
		if(responder[this.lowerName+'out']) responder[this.lowerName+'out'](responder.element, event, responder, mover);
	}, 
	/**
	 * Calls dropover
	 * @param {Object} drop
	 * @param {Object} drag
	 * @param {Object} event
	 */
	activate: function(responder, mover, event) { //this is where we should call over
		this.last_active = responder;
        if(responder[this.lowerName+'over']) responder[this.lowerName+'over']( responder.element, event, responder, mover);
	},
    move : function(responder, mover, event){
        if(responder[this.lowerName+'move']) responder[this.lowerName+'move']( responder.element, event, responder, mover);
    },
	/**
	* Gives a point, the object being dragged, and the latest mousemove event.
	* Go through each droppable and see if it is affected.  Called on every mousemove.
	* @param {Object} point
	* @param {Object} drag
	* @param {Object} event
	*/
	show: function(point, moveable, event) {
		
		var element = moveable.element;
		if(!this._responders.length) return;
		
		var respondable, affected = [];

		for(var d =0 ; d < this._responders.length; d++ ){
		    if(this.isAffected(point, element, this._responders[d])) 
				affected.push(this._responders[d]);   
		}

		respondable = this.findDeepestChild(affected);
		
        
		//if we've activated something, but it is not this respondable, deactivate (dropout)
		if(this.last_active && this.last_active != respondable) 
		    this.deactivate(this.last_active, moveable, event);
		
		//if we have something, dropover it
		if (respondable && respondable != this.last_active) 
		  this.activate(respondable, moveable, event);
		
        if(respondable && this.last_active){
          this.move(respondable, moveable, event);
        }
	},
	/**
	 * Called on mouse up of a dragged element.
	 * @param {Object} event
	 * @param {Object} element
	 */
	end: function(event, moveable) {
		if(this.last_active && this.isAffected(event.pointer(), moveable.element, this.last_active) && //last is still activated
			this.last_active[this.endName]	){ 											//drop was ok
            this.last_active[this.endName](this.last_active.element, event, this.last_active, moveable); 
		}
		this.clear();
	},
	/**
	* Called when the user first starts to drag.  Uses query to get
	* all possible droppable elements and adds them.
	*/
	compile : function(event){
      var el, drops, selector, sels;
	  for(var i=0; i < this._elements.length; i++){ //for each element
		  el = this._elements[i]
		  drops = jQuery.data(el,"drop_callbacks")
          for(selector in drops){ //find the selectors
			  sels = selector ? jQuery(selector, el) : [el];
			  for(var e= 0; e < sels.length; e++){ //for each found element, create a drop point
    	          jQuery.removeData(sels[e],"offset");
              	  this.add(sels[e], new this(drops[selector]));
    	      }
    	  }
	  }

	},
	/**
	* Called after dragging has stopped.
	*/
	clear : function(){
	  this._responders = [];
	}
},
/* @Prototype */
{
    init : function(callbacks, element){
        jQuery.extend(this,callbacks);
        this.element = element;
    },
    
    /**
     * Caches positions of draggable elements.  This should be called in dropadd.  For example:
     * @code_start
     * dropadd : function(params){ params.cache_position() }
     * @code_end
     */
	cache_position: function(value){
        this._cache = value != null ? value : true;
    },
	/**
	 * cancels this drop
	 */
    cancel : function(){
        this._cancel = true;
    }
})
