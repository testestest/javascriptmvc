// we don't include the plugin file because thats done after the app file (in case jquery is loaded)


$.include.plugins("jquery","dom",'lang','lang/class','lang/openajax','dom/synthetic')

if(!window._rhino){
    $.include.plugins('console')
}else{
    $.Console = {log: function(txt){
        print(txt);
    }}
}


$.include(
    'test',
    'runner',
    'assertions',
    'unit',
    'functional',
    'controller')