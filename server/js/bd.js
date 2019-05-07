/********** Js de la base de datos en Mongo *********/
const mongoose = require('mongoose');
const nombre_bd='contactos';

/* esquema de los datos del documento mongoose */

const esq_contacto = new mongoose.Schema({
    nombre:   {type:String, required: true },
    tel1:     {type:String},
    tel2:     {type:String},
    direccion:{type:String},
    correo:   {type:String},
    tipo:     {type:String}
}); 

//conecta a la base de datos, si no la crea con el nombre especificado en nombre_bd.
mongoose.connect('mongodb://localhost/'+nombre_bd, {'useNewUrlParser': true})//promesa de conexión para que muestre mensaje en consola cuando se realice la conexión.
    .then(() => {
        console.log('La base de datos: '+ nombre_bd +' se conectó exitosamente.')
    })
    .catch(err=>console.error(err));

/* exportamos la clase contacto para que pueda crearse un documento nuevo. */
/* compilamos nuestro esquema en un modelo, un modelo es una clase que construye documentos*/
module.exports = mongoose.model('Contacto', esq_contacto); 