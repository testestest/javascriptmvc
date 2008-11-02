/**
 * Documents a function
 */
MVC.Doc.Function = MVC.Doc.Pair.extend('function',
{
    code_match: /([\w\.]+)\s*[:=]\s*function\(([^\)]*)/
},
{
    code_setup: function(){
        var parts = this.Class.code_match(this.code);
        this.name = parts[1];
        this.params = {};
        this.ret = {type: 'undefined',description: ""}
        var params = parts[2].match(/\w+/);
        if(!params) return;
        
        for(var i = 0 ; i < params.length; i++){
            this.params[params[i]] = {description: "", type: "", optional: false, order: i, name: params[i]};
        }
        
    },
    comment_setup: function(){
        var i = 0;
        var lines = this.comment.split("\n");
        this.real_comment = '';
        if(!this.params) this.params = {};
        if(!this.ret) this.ret = {type: 'undefined',description: ""};
        var last, last_data;

        for(var l=0; l < lines.length; l++){
            var line = lines[l];
            var match = line.match(/@(\w+)/)
            if(match){
                var fname = (match[1]+'_add').toLowerCase();
                if(! this[fname]) continue;
                last_data = this[fname](line);
                if(last_data) last = match[1].toLowerCase(); else last = null;
            }
            else if(!line.match(/^constructor/i) && !last )
                this.real_comment+= line+"\n"
            else if(last && this[last+'_add_more']){
                this[last+'_add_more'](line, last_data);
            }
        }
    },
    param_add_more : function(line, last){
        if(last);
            last.description += "\n"+line;
    },
    param_add: function(line){
        var parts = line.match(/@param (?:\{(?:(optional):)?([\w\.\/]+)\})? ?([\w\.]+) ?(.*)?/);
        if(!parts) return;
        
        var description = parts.pop();
        var n = parts.pop();
        
        var param = this.params[n] ? this.params[n] : this.params[n] = {order: this.ordered_params().length };

        param.description = description || "";
        param.name = n;
        param.type = parts.pop()|| "";
        param.optional = parts.pop() ? true : false;
        
        return this.params[n];
    },
    return_add: function(line){
        var parts = line.match(/@return (?:\{([\w\.\/]+)\})? ?(.*)?/);
        if(!parts) return;
        var description = parts.pop() || "";
        var type = parts.pop();
        this.ret = {description: description, type: type};
        return this.ret;
    },
    function_add: function(line){
        var m = line.match(/^@\w+ ([\w\.]+)/)
        if(m) this.name = m[1];
    },
    signiture : function(){
        var res = [];
        var ordered = this.ordered_params();
        for(var n = 0; n < ordered.length; n++){
            var param = ordered[n];
            res.push(param.name)
        }
        
        var n = this.name;
        return n+"("+res.join(", ")+") -> "+this.ret.type;
    }
});