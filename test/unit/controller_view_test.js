$.Test.Unit.extend('ControllerView',{
	init: function(){
          $('#testarea').html("<div id='render_here' style='width: 100px; height:100px;background-color: Green'></div>")
    },
    destroy: function(){
          $('#testarea').html("");
    },
    test_render_to : function(){
		
        MVC.Controller.publish('render_to', {}); //this should render
		var el = document.getElementById('render_here');
		this.assertEqual("H1", el.firstChild.nodeName);
		this.assertEqual("HelloWorld", el.firstChild.innerHTML);
	},
	test_render_to_with_element : function(){
		RenderController.dispatch('to_element',{} );
		var el = document.getElementById('render_here');
		this.assertEqual("H1", el.firstChild.nodeName);
		this.assertEqual("HelloWorld", el.firstChild.innerHTML);
	},
	// fails with no_element
	test_render_after: function(){
		RenderController.dispatch( 'after', {});
		this.assertEqual("HelloWorld", document.getElementById('after').innerHTML );
		var part = document.getElementById('render_here');
		this.assertEqual("after",  part.nextSibling.id);
	}
});

