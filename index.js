/* Aplicación princial */
const express = require("express"),
    path = require('path'), //modulo de node para las rutas sin importar el sistema operativo.
    Contacto = require('./server/js/bd.js'), //requerimos el código de la base de datos.
    body_parser = require('body-parser'), //declaramos variable para middleware que se llama body-parser, que nos ayudará a acceder al contenido del cuerpo de las peticiones.
    hbs = require('hbs'); //instanciamos HBS para hacer algunas declaraciones de rutas.

/*:::::::::: Variables Globales::::::::::::::: */
//let mensaje = {}; /* Variable global con los mensajes de éxito y modificación */
//let datosContacto = {}; //datos de contacto para presentar en otra vista.


//:::::inicializaciones
const app = express();
const ruta = path.join(__dirname,'/server'); //ruta de las aplicaciones del server


//::::configuraciones:
app.set('port', process.env.PORT || 3000); //usamos el puerto si el servidor nos lo da, sino el 3000
app.set('view engine', 'hbs'); //establecemos el motor para las vistas.
app.set('views', path.join( __dirname, '/server/views')); //establecemos vistas
app.set('view options', { layout: '/template' }); //establecemos el layout
//hbs.registerPartials(path.join( __dirname, '/server/views/partials')); //indicamos en donde estan los partials


//:::::::::Midlewares:::::::

//elementos estáticos, css, js, etc.
app.use(express.static(ruta)); //Node / ExpressJS necesita explicitamente saber donde estan sus recursos estaticos.
app.use(body_parser.urlencoded({extended:true})); //inicializamos el middleware con los contenidos externos que vamos a utilizar, los contenidos del cuerpo de la respuesa GET/POST
app.use(body_parser.json()); //parsin para el cuerpo cuando hacemos solicitudes con formato application/json

//Routes, que es como se comporta la app en determinadas circunstancias
app.get('/', async (req, res) => { /*  */
    const docs = await Contacto.find();//sacamos los documentos de la base de datos usando el esquema, siempre usar await:ojo.
    //enviamos la lista de los documentos para renderear como si fuera un {objeto}.
    res.render('main',{docs});
});

//ruta de alta de nuevo contacto.
app.post('/nuevo', async (req,res)=>{   
    const errores = [] //arreglo con los errores en caso de presentarse en validación de datos.
    const datos = {  //variable con los datos extraídos de la petición POST
        nombre   : req.body.nombre,
        tel1     : req.body.tel1,
        tel2     : req.body.tel2,
        direccion: req.body.direccion,
        correo   : req.body.correo,
        tipo     : req.body.tipo
    };
    let docs = await Contacto.find();//sacamos los documentos de la base de datos usando el esquema, siempre usar await:ojo.
    //Mensajes de Errores en la alta de contacto
    if (!datos.nombre) {
        //sí falta el nombre
        errores.push({msg:"Por favor, inserte un nombre para el contacto."});
    }
    if (await Contacto.findOne({nombre: datos.nombre})){ //encontramos coincidencia
            errores.push({msg:"El contacto de nombre "+ datos.nombre +" ¡ya existe!, NO se dió de alta."});
    }
    if ((!datos.tel1)&&(!datos.tel2)&&(!datos.direccion)&&(!datos.correo)){
        errores.push ({msg:"Por favor, inserte cuando menos un dato de contacto."});
    }    
    if (errores.length > 0){
        //si hay errores, renderizar la vista con los errores y los datos que ya puso.
        res.render('main', {errores, datos,docs});
    }else{ 
        /* no se encontró ningun error */
        var nuevo = new Contacto (datos); //cargamos los datos del nuevo contacto en la nueva instancia del modelo Mongosse
        nuevo.save(async (err)=>{ //guardamos los datos en base de datos.    
            if (err) throw err;             
            console.log('Se dió de alta un nuevo contacto.');
            const msg = "Contacto dado de alta." //Mensaje de éxito al dar de alta.
            docs = await Contacto.find(); //buscamos otra vez los registros para tener actualizada la tabla
            res.render('main', {msg, docs});
        }); 
    };
});

//ruta de moficación de contacto
app.get('/modifica', async(req, res)=> {
    const docs = await Contacto.find();//recupera todos los documentos de la base de datos.
    let datos = await Contacto.findById(req.query.id); //datos del contacto de la base de datos
    res.render('main',{docs, datos});   
});

//app.put();

app.get('/borrar', async(req, res)=> {
    //docs = {};
    const docs = await Contacto.find();//todos los documentos de la base de datos.
    /*  if (confirm("Estás seguro de Borrar los datos")){
        alert("Contacto Borrado."); */
        await Contacto.findOneAndDelete(req.query.id); //borramos el documento seleccionado.
        res.render('main',{docs}); 
/*     } else res.end();//terminamos la solicitud, y dejamos la página tal y como está. */
});

//La app se pone a escuchar las peticiones en el puerto que tenga el SO o el 3000 si no se asigna
app.listen(app.get('port'), ()=> {
    console.log("Servidor corriendo en el puerto: "+app.get('port'));
}); 