/*
 * Provides abstract functionality for a wide variety of models.  It provides a base which 
 * one can assume all other models must have.  A model must provide:
 * <ul>
 *     <li>Model.find_one</li>
 *     <li>Model.find_all</li>
 *     <li>Model.create</li>
 *     <li>Model.update</li>
 * </ul>
 * Model is also designed to work with ModelViewHelper.
 */
MVC.Model = MVC.Class.extend(
/*@Static*/
{
	store_type: MVC.SimpleStore,
    /**
     * Finds objects in this class
     * @param {Object} id the id of a object
     * @param {Object} params params passed to the 
     * @param {Object} callbacks a single onComplete callback or a hash of callbacks
     * @return {Model} will return instances of the model if syncronous
     */
	init: function(){
		if(!this.className) return;
        MVC.Model.models[this.className] = this;
        this.store = new this.store_type(this);
	},
    find : function(id, params, callbacks){
        if(!params)  params = {};
        if(typeof params == 'function') {
            callback = params;
            params = {};
        }
        if(id == 'all'){
            return this.create_many_as_existing( this.find_all(params, callbacks)  );
        }else{
            if(!params[this.id] && id != 'first')
                params[this.id] = id;
            return this.create_as_existing( this.find_one(id == 'first'? null : params, callbacks) );
        }
    },
    asynchronous : true,
    /**
     * Used to create an existing object from attributes
     * @param {Object} attributes
     * @return {Model} an instance of the model
     */
    create_as_existing : function(attributes){
        if(!attributes) return null;
        if(attributes.attributes) attributes = attributes.attributes();
        var inst = new this(attributes);
        inst.is_new_record = this.new_record_func;
        return inst;
    },
    /**
     * Creates many instances
     * @param {Object} instances
     * @return {Array} an array of instances of the model
     */
    create_many_as_existing : function(instances){
        if(!instances) return null;
        var res = [];
        for(var i =0 ; i < instances.length; i++)
            res.push( this.create_as_existing(instances[i]) );  
        return res;
    },
    /**
     * The name of the id field.  Defaults to 'id'
     */
    id : 'id', //if null, maybe treat as an array?
    new_record_func : function(){return false;},
    validations: [],
    has_many: function(){
        for(var i=0; i< arguments.length; i++){
            this._associations.push(arguments[i]);
        }
    },
    belong_to: function(){
        for(var i=0; i< arguments.length; i++){
            this._associations.push(arguments[i]);
        }
    },
    _associations: [],
    /**
     * Creates an instance of the object from an HTML element.
     * @param {Object} element_or_id
     */
    from_html: function(element_or_id){
        var el =MVC.$E(element_or_id);
        var el_class = window[ MVC.String.classize(el.getAttribute('type')) ];
        
        if(! el_class) return null;
        //get data here
        var attributes = {};
        attributes[el_class.id] = this.element_id_to_id(el.id);
        return el_class.create_as_existing(attributes);
    },
    /**
     * Takes an element ID like 'todo_5' and returns '5'
     * @param {Object} element_id
     * @return {String} 
     */
    element_id_to_id: function(element_id){
        var re = new RegExp(this.className+'_', "");
        return element_id.replace(re, '');
    },
    /**
     * Adds an attribute to the list of attributes for this class.
     * @param {String} property
     * @param {String} type
     */
    add_attribute : function(property, type){
        if(! this.attributes[property])
            this.attributes[property] = type;
    },
    attributes: {},
    /**
     * Used for converting callbacks to to seperate error and succcess
     * @param {Object} callbacks
     */
    _clean_callbacks : function(callbacks){
        if(!callbacks) {
            if(this.asynchronous) throw "You must supply a callback!"; else return null;
        }
        if(typeof callbacks == 'function')
            return {onSuccess: callbacks, onError: callbacks};
        if(!callbacks.onSuccess && !callbacks.onComplete) throw "You must supply a positive callback!";
        if(!callbacks.onSuccess) callbacks.onSuccess = callbacks.onComplete;
        if(!callbacks.onError && callbacks.onComplete) callbacks.onError = callbacks.onComplete;
		return callbacks;
    },
    models : {}
},
/*@Prototype*/
{   
    /**
     * Creates, but does not save a new instance of this class
     * @param {Object} attributes -> a hash of attributes
     */
    init : function(attributes){
        //this._properties = [];
        this.errors = [];
        
        this.set_attributes(this.Class._attributes || {});
        this.set_attributes(attributes);
    },
    setup : function(){
        
    },
    /**
     * Sets a hash of attributes for this instance
     * @param {Object} attributes
     */
    set_attributes : function(attributes)
    {
        for(var key in attributes){ 
			if(attributes.hasOwnProperty(key)) 
				this._setAttribute(key, attributes[key]);
		}
        return attributes;
    }, 
    /**
     * Sets the attributes on this instance and calls save.
     * @param {Object} attributes
     * @param {Object} callback
     */
    update_attributes : function(attributes, callback)
    {
        this.set_attributes(attributes);
        return this.save(callback);
    },
    valid : function() {
      	return  this.errors.length == 0;
    },
    /**
     * Validates this instance
     */
    validate : function(){
        //run validate function and any error functions  
        
    },
    _setAttribute : function(attribute, value) {
        if (MVC.Array.include(this.Class._associations, attribute))
          this._setAssociation(attribute, value);
        else
          this._setProperty(attribute, value);
    },
    _setProperty : function(property, value) {  
        //add to cache, this should probably check that the id isn't changing.  If it does, should update the cache
        var old = this[property]
        
            

        this[property] = MVC.Array.include(['created_at','updated_at'], property) ? MVC.Date.parse(value) :  value;
        if(property == this.Class.id && this.Class.store){
            if(!old){
                this.Class.store.create(this);
            }else if(old != this[property]){
                this.Class.store.destroy(old);
                this.Class.store.create(this);
            }
        }
        //if (!(MVC.Array.include(this._properties,property))) this._properties.push(property);  
        
        this.Class.add_attribute(property, MVC.Object.guess_type(value)  );
    },
    _setAssociation : function(association, values) {
        this[association] = function(){
            if(! MVC.String.is_singular(association ) ) association = MVC.String.singularize(association);
            var associated_class = window[MVC.String.classize(association)];
            if(!associated_class) return values;
            return associated_class.create_many_as_existing(values);
        }
        
    },
    /**
     * Returns a list of attribues.
     * @return {Object}
     */
    attributes : function() {
        var attributes = {};
        var cas = this.Class.attributes;
        for(var attr in cas){
            if(cas.hasOwnProperty(attr) ) attributes[attr] = this[attr];
        }
        //for (var i=0; i<this.attributes.length; i++) attributes[this._properties[i]] = this[this._properties[i]];
        return attributes;
    },
    /**
     * Returns if the instance is a new object
     */
    is_new_record : function(){ return true;},
    /**
     * Saves the instance
     * @param {optional:Function} callback or object of callbacks
     */
    save: function(callbacks){
        var result;
        this.errors = [];
        this.validate();
        if(!this.valid()) return false;
        result = this.is_new_record() ? 
            this.Class.create(this.attributes(), callbacks) : 
            this.Class.update(this[this.Class.id], this.attributes(), callbacks);

        this.is_new_record = this.Class.new_record_func;
        return true;
    },
    /**
     * Destroys the instance
     * @param {Object} {optional:Function} callback or object of callbacks
     */
    destroy : function(callback){
        this.Class.destroy(this[this.Class.id], callback);
        this.Class.store.destroy(this[this.Class.id]);
    },
    add_errors : function(errors){
        if(errors) this.errors = this.errors.concat(errors);
    },
    _resetAttributes : function(attributes) {
        this._clear();
        /*for (var attr in attributes){
    		if(attributes.hasOwnProperty(attr)){
    			this._setAttribute(attr, attributes[attr]);
    		}
    	}*/
    },
    _clear : function() {
        var cas = this.Class.attributes;
        for(var attr in cas){
            if(cas.hasOwnProperty(attr) ) this[attr] = null;
        }
    }
});


MVC.Object.guess_type = function(object){
    if(typeof object != 'string'){
        if(object == null) return typeof object;
        if( object.constructor == Date ) return 'date';
        if(object.constructor == Array) return 'array';
        return typeof object;
    }
    //check if true or false
    if(object == 'true' || object == 'false') return 'boolean';
    if(!isNaN(object)) return 'number'
    return typeof object;
}