
importScripts("js/sw-utils.js");
const STATIC_CACHE='static-v1';
const DYNAMIC_CACHE='dinamico-v1';
const INMUTABLE_CACHE='inmutable-v1';




const APP_SHELL=[
/*     '/', */
    'index.html',
    'css/style',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];
//todo lo que no se va a modificar nunca
const APP_SHELL_INMUTABLE=[
'https://fonts.googleapis.com/css?family=Quicksand:300,400',
'https://fonts.googleapis.com/css?family=Lato:400,300',
'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
'https://fonts.gstatic.com/s/lato/v23/S6uyw4BMUTPHjx4wXiWtFCc.woff2',
'css/animate.css'
];


self.addEventListener('install',e=>{
    const cacheStatic=caches.open(STATIC_CACHE).then(cache=>{
        cache.addAll(APP_SHELL)
    });


    const cacheInmutable=caches.open(INMUTABLE_CACHE).then(cache=>{
        cache.addAll(APP_SHELL_INMUTABLE);
    });

    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));
});


self.addEventListener('activate', e => {

    const resp= caches.keys().then(keys=>{
        keys.forEach(key=>{
            if(key!==STATIC_CACHE&& key.includes('static')){
                return caches.delete(key);
            }
        })
    });
    e.waitUntil(resp);
});



self.addEventListener('fetch', e => {




    const respuesta = caches.match( e.request )
    .then( res => {

        if ( res ) return res;

        // No existe el archivo
        // tengo que ir a la web
        console.log('No existe', e.request.url );


        return fetch( e.request ).then( newResp => {

            return actualizaCacheDinamico(DYNAMIC_CACHE,e.request,newResp);
  
            return newResp.clone();
        })
        .catch(err=>{

               if(e.request.headers.get('accept').includes('text/html')){
                   return caches.match('/pages/offline.html');
               }
               
           })


    });




e.respondWith( respuesta );

});