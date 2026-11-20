// Forja — service worker: funciona sem internet e se atualiza sozinho
const CACHE='forja-v2.0';
const SHELL=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','icons/maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 // fontes do Google: guarda depois do primeiro uso
 if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith(caches.open(CACHE).then(c=>c.match(r).then(h=>h||fetch(r).then(res=>{c.put(r,res.clone());return res}))));return}
 if(u.origin!==location.origin)return;
 // app: mostra a versão salva na hora e busca a nova em segundo plano
 e.respondWith(caches.open(CACHE).then(c=>c.match(r,{ignoreSearch:true}).then(h=>{const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>h);return h||net})))});
