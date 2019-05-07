/* JS con algunas funciones del front End de la página principal */

function limpiar_campos(){
    /* función que limpia los campos de la página de Vehículos */
    $("#nombre").val("");
    $("#tel1").val("");
    $("#tel2").val("");
    $("#direccion").val("");
    $("#correo").val("");
    $("#tipo").val("");
    $("#nombre").focus();
};

function borrar(id){
    if (confirm("¿Borrar éste Contacto?")){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        xmlHttp.send(null);
    }
};

$(function(){
    /* inicializaciones */

    //Botón de vehiculos limpia campos.
    $("#principal").on('click','#btn-limpiar', e =>{
        e.preventDefault();
        limpiar_campos();
    });

    
  
});