// Caché de imágenes de Supabase Storage: cada foto se descarga una sola vez por dispositivo.
const IMG="matambre-img-v1",MAX=200;
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET"||r.destination!=="image"||!r.url.includes("/storage/v1/"))return;
  e.respondWith(caches.open(IMG).then(async c=>{
    const hit=await c.match(r);
    if(hit)return hit;
    try{
      const res=await fetch(r);
      if(res.ok||res.type==="opaque"){c.put(r,res.clone());trim(c)}
      return res;
    }catch(err){return Response.error()}
  }));
});
async function trim(c){const k=await c.keys();if(k.length>MAX)for(const x of k.slice(0,k.length-MAX))await c.delete(x)}
