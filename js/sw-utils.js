 function actualizaCacheDinamico(dynamicCache,req,res){
    if(res.ok){
        caches.open(dynamicCache).then(cache=>{
            cache.put(req,res.clone());
            limpiarCache( dynamicCache, 50 );
            return res.clone()
        })
    }
    else{
        return res;
    }
}


 function limpiarCache( cacheName, numeroItems ) {


    caches.open( cacheName )
        .then( cache => {

            return cache.keys()
                .then( keys => {
                    
                    if ( keys.length > numeroItems ) {
                        cache.delete( keys[0] )
                            .then( limpiarCache(cacheName, numeroItems) );
                    }
                });

            
        });
}