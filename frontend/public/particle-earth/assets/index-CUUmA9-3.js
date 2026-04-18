import{r as d,j as a,K as it,R as rt}from"./vendor-Cncy09X1.js";import{s as we,e as Se,B as at,u as G,a as st,b as lt,C as ct}from"./three-react-BG0uF0LI.js";import{u as ue,L as ut}from"./controls-Cmia45ro.js";import{M as x,g as _,Q as Pe,o as dt,e as v,p as N,D as ze,h as me,q as K,r as pt,s as ht,t as mt,u as Q,v as de,w as $,x as ft,y as pe,z as he,E as gt,F as xt,G as wt,H as St,I as yt}from"./three-core-D52OkAEL.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();const fe=[{name:"Tokyo",latitude:35.6762,longitude:139.6503,weight:1},{name:"Delhi",latitude:28.6139,longitude:77.209,weight:.98},{name:"Shanghai",latitude:31.2304,longitude:121.4737,weight:.96},{name:"Mumbai",latitude:19.076,longitude:72.8777,weight:.95},{name:"Sao Paulo",latitude:-23.5505,longitude:-46.6333,weight:.94},{name:"Mexico City",latitude:19.4326,longitude:-99.1332,weight:.93},{name:"Beijing",latitude:39.9042,longitude:116.4074,weight:.92},{name:"Cairo",latitude:30.0444,longitude:31.2357,weight:.91},{name:"Dhaka",latitude:23.8103,longitude:90.4125,weight:.9},{name:"New York",latitude:40.7128,longitude:-74.006,weight:.9},{name:"Karachi",latitude:24.8607,longitude:67.0011,weight:.89},{name:"Buenos Aires",latitude:-34.6037,longitude:-58.3816,weight:.87},{name:"Lagos",latitude:6.5244,longitude:3.3792,weight:.86},{name:"Istanbul",latitude:41.0082,longitude:28.9784,weight:.85},{name:"Moscow",latitude:55.7558,longitude:37.6173,weight:.83},{name:"Jakarta",latitude:-6.2088,longitude:106.8456,weight:.82},{name:"Manila",latitude:14.5995,longitude:120.9842,weight:.81},{name:"Seoul",latitude:37.5665,longitude:126.978,weight:.8},{name:"Bangkok",latitude:13.7563,longitude:100.5018,weight:.79},{name:"London",latitude:51.5072,longitude:-.1276,weight:.78},{name:"Paris",latitude:48.8566,longitude:2.3522,weight:.77},{name:"Los Angeles",latitude:34.0522,longitude:-118.2437,weight:.76},{name:"Singapore",latitude:1.3521,longitude:103.8198,weight:.75},{name:"Hong Kong",latitude:22.3193,longitude:114.1694,weight:.74},{name:"Dubai",latitude:25.2048,longitude:55.2708,weight:.73},{name:"Sydney",latitude:-33.8688,longitude:151.2093,weight:.72},{name:"Johannesburg",latitude:-26.2041,longitude:28.0473,weight:.71},{name:"Toronto",latitude:43.6532,longitude:-79.3832,weight:.7},{name:"Rio de Janeiro",latitude:-22.9068,longitude:-43.1729,weight:.69},{name:"Nairobi",latitude:-1.2921,longitude:36.8219,weight:.68},{name:"San Francisco",latitude:37.7749,longitude:-122.4194,weight:.67},{name:"Berlin",latitude:52.52,longitude:13.405,weight:.66},{name:"Riyadh",latitude:24.7136,longitude:46.6753,weight:.65},{name:"Santiago",latitude:-33.4489,longitude:-70.6693,weight:.64}];function ye(e){typeof window>"u"||(window.__particleEarthDebug={...window.__particleEarthDebug,...e})}const Mt=new _(0,1,0);function vt(e,t,n){const r=2/t,o=Math.PI*(3-Math.sqrt(5)),i=1-(e*r+r/2),l=Math.sqrt(Math.max(0,1-i*i)),c=e*o;return new _(Math.cos(c)*l*n,i*n,Math.sin(c)*l*n)}function ne(e,t,n){const r=x.degToRad(e),o=x.degToRad(t),i=Math.cos(r);return new _(Math.cos(o)*i*n,Math.sin(r)*n,-Math.sin(o)*i*n)}function Rt(e,t){return{x:x.degToRad(e),y:x.euclideanModulo(-Math.PI/2-x.degToRad(t)+Math.PI,Math.PI*2)-Math.PI}}function bt(e,t){const n=ne(e.latitude,e.longitude,1).normalize();return{position:n.clone().multiplyScalar(t),normal:n,quaternion:new Pe().setFromUnitVectors(Mt,n)}}function Ie(e,t,n,r,o){const i=Math.max(2,Math.floor(o)),l=ne(e.latitude,e.longitude,1).normalize(),c=ne(t.latitude,t.longitude,1).normalize(),u=Math.acos(x.clamp(l.dot(c),-1,1)),m=Math.sin(u),h=[];for(let p=0;p<=i;p+=1){const f=p/i,w=Math.sin(Math.PI*f)*r;let S;m<1e-4?S=l.clone().lerp(c,f).normalize():S=l.clone().multiplyScalar(Math.sin((1-f)*u)/m).add(c.clone().multiplyScalar(Math.sin(f*u)/m)).normalize(),h.push(S.multiplyScalar(n+w))}return h}function Ct(e){const t=Math.sqrt(e.x**2+e.y**2+e.z**2)||1,n=e.x/t,r=e.y/t,o=e.z/t,i=.5+Math.atan2(-o,n)/(Math.PI*2),l=.5-Math.asin(x.clamp(r,-1,1))/Math.PI;return{u:i,v:l}}function At(e,t,n){const r=(t%1+1)%1,o=x.clamp(n,0,.999999),i=Math.min(e.width-1,Math.floor(r*e.width)),c=(Math.min(e.height-1,Math.floor(o*e.height))*e.width+i)*4;return e.data[c]}function Pt(e,t,n,r){const o=At(e,t,n);return o>=r?o/255:0}function zt(e){const t=e.image,n=t.width??0,r=t.height??0;if(!n||!r)throw new Error("Terrain texture image is missing dimensions.");const o=document.createElement("canvas");o.width=n,o.height=r;const i=o.getContext("2d");if(!i)throw new Error("Unable to create a 2D context for the terrain texture.");i.drawImage(t,0,0,n,r);const{data:l}=i.getImageData(0,0,n,r);return{width:n,height:r,data:l}}function It(e,t){const n=[],r=[],o=[],i=[];for(let l=0;l<t.sampleCount;l+=1){const c=vt(l,t.sampleCount,t.radius),{u,v:m}=Ct(c),h=Pt(e,u,m,t.landThreshold);if(h<=0)continue;const p=h*t.terrainHeightScale,f=c.clone().multiplyScalar(1+p);n.push(f.x,f.y,f.z);const w=c.clone().normalize();r.push(w.x,w.y,w.z);const S=(Math.sin(l*12.9898)+1)*.5;o.push(S),i.push(p)}return{positions:new Float32Array(n),basePositions:new Float32Array(n),heights:new Float32Array(i),normals:new Float32Array(r),seeds:new Float32Array(o),count:o.length}}const Et=new _(0,1,0),Dt=2.2,Tt="Singapore",be=fe.reduce((e,t)=>({min:Math.min(e.min,t.weight),max:Math.max(e.max,t.weight)}),{min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY}),jt=Array.from({length:16},(e,t)=>t*Math.PI/16),Ft=`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Ot=`
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    float v = clamp(vUv.y, 0.0, 1.0);
    float distanceFromCenter = abs(vUv.x - 0.5);
    float width = mix(0.48, 0.035, pow(v, 0.88));
    float core = 1.0 - smoothstep(width * 0.2, width, distanceFromCenter);
    float haze = 1.0 - smoothstep(width * 0.95, width * 1.8, distanceFromCenter);
    float verticalFade = pow(1.0 - v, 0.92);
    float baseBloom = exp(-pow((v - 0.08) / 0.14, 2.0));
    float tipBloom = exp(-pow((v - 0.78) / 0.2, 2.0));
    float alpha = core * verticalFade + haze * baseBloom * 0.42 + core * tipBloom * 0.12;

    if (alpha <= 0.0015) {
      discard;
    }

    gl_FragColor = vec4(uColor, alpha * uOpacity);
  }
`;function _t({geometry:e,width:t,height:n,opacity:r,color:o}){return a.jsx("group",{children:jt.map(i=>a.jsx("mesh",{geometry:e,rotation:[0,i,0],scale:[t,n,1],renderOrder:2,children:a.jsx("shaderMaterial",{vertexShader:Ft,fragmentShader:Ot,uniforms:{uColor:{value:o.clone()},uOpacity:{value:r}},transparent:!0,depthWrite:!1,toneMapped:!1,side:ze,blending:N},`${i}-${o.getHexString()}-${r.toFixed(4)}-${t.toFixed(4)}-${n.toFixed(4)}`)},`${i}-${t.toFixed(4)}-${n.toFixed(4)}-${r.toFixed(4)}`))})}function Nt({radius:e,glowColor:t,glowSize:n,glowStrength:r,sizeVariance:o,singaporeGlowSize:i,singaporeGlowStrength:l}){const c=d.useMemo(()=>{const h=new dt(1,1,1,24);return h.translate(0,.5,0),h},[]),u=d.useMemo(()=>new v(t).lerp(new v("#ffffff"),.45),[t]),m=d.useMemo(()=>{const h=x.clamp(r/Dt,0,1),p=x.lerp(0,1.55,x.smootherstep(h,0,1)),f=x.lerp(.45,1.45,Math.pow(h,.72)),w=x.lerp(0,1.75,o);return fe.map(S=>{const z=ne(S.latitude,S.longitude,1).normalize(),B=z.clone().multiplyScalar(e-.0025),j=new Pe().setFromUnitVectors(Et,z),R=x.inverseLerp(be.min,be.max,S.weight),C=x.lerp(.12,1,Math.pow(R,.68)),L=x.lerp(.34,1,Math.pow(R,.8)),I=Math.pow(L,w),E=S.name===Tt,A=E?i:1,F=E?l:1,D=n*x.lerp(.032,.082,R)*f*I*A,y=n*x.lerp(.13,.34,R)*f*I*A,P=p*C*F;return{name:S.name,position:B.toArray(),quaternion:j.toArray(),layers:[{width:D*1.5,height:y*.92,opacity:P*.035,color:u.clone()},{width:D,height:y,opacity:P*.06,color:new v(t)},{width:D*.62,height:y*1.08,opacity:P*.024,color:u.clone()}]}})},[u,t,n,r,e,o,i,l]);return d.useEffect(()=>{ye({cityBeaconCount:fe.length})},[]),d.useEffect(()=>()=>{c.dispose()},[c]),a.jsxs("group",{children:[a.jsxs("mesh",{renderOrder:1,children:[a.jsx("sphereGeometry",{args:[e*.998,96,96]}),a.jsx("meshBasicMaterial",{color:"#000000",colorWrite:!1,depthWrite:!0,toneMapped:!1})]}),m.map(h=>a.jsx("group",{position:h.position,quaternion:h.quaternion,children:h.layers.map((p,f)=>a.jsx(_t,{geometry:c,width:p.width,height:p.height,opacity:p.opacity,color:p.color},`${h.name}-${f}-${p.width.toFixed(4)}-${p.height.toFixed(4)}-${p.opacity.toFixed(4)}`))},h.name))]})}const ge=new me(-.82,.58).normalize(),Bt=.29,Lt=we({glowColor:new v("#56b8ff"),accentColor:new v("#cbeeff"),innerRadius:.74,outerRadius:1,lightDirection:ge,crestDirection:ge,intensity:1,edgeSoftness:1},`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,`
    uniform vec3 glowColor;
    uniform vec3 accentColor;
    uniform float innerRadius;
    uniform float outerRadius;
    uniform vec2 lightDirection;
    uniform vec2 crestDirection;
    uniform float intensity;
    uniform float edgeSoftness;

    varying vec2 vUv;

    void main() {
      vec2 centered = vUv * 2.0 - 1.0;
      float radius = length(centered);
      float overlap = 0.04;

      if (radius <= innerRadius - overlap || radius >= outerRadius) {
        discard;
      }

      float haloWidth = max(outerRadius - innerRadius, 0.0001);
      float outsideDistance = max(radius - innerRadius, 0.0) / haloWidth;
      vec2 radialDirection = centered / max(radius, 0.0001);
      float outsideMask = smoothstep(innerRadius - overlap, innerRadius + 0.008, radius);
      float outerFade = 1.0 - smoothstep(outerRadius - 0.18, outerRadius, radius);
      float directional = smoothstep(-0.22, 1.0, dot(radialDirection, normalize(lightDirection)));
      float broadLight = pow(directional, 1.5);
      float crest = pow(max(dot(radialDirection, normalize(crestDirection)), 0.0), 4.8);
      float nearSurface = exp(-outsideDistance * (5.8 - edgeSoftness * 1.2));
      float farBloom = exp(-outsideDistance * (2.3 + edgeSoftness * 0.45));
      float alpha = outsideMask
        * outerFade
        * intensity
        * (
          farBloom * (0.028 + broadLight * 0.2)
          + nearSurface * (0.03 + broadLight * 0.34 + crest * 0.28)
        );
      float accent = clamp(broadLight * 0.72 + crest * 0.85, 0.0, 1.0);
      vec3 color = mix(glowColor, accentColor, accent);
      gl_FragColor = vec4(color * alpha * 1.4, alpha);
    }
  `);Se({AtmosphereGlowMaterial:Lt});function Gt({globeRadius:e,radius:t,glowDistance:n,glowStrength:r,glowColor:o,sunDirection:i}){const l=Math.max(0,n-Bt),c=Math.max(e*(2.7+l*3.2),t*(2.58+l*3)),u=e/(c*.5),m=Math.min(.998,u+n),h=new me(i[0],i[1]+i[2]*.3),p=h.lengthSq()<1e-4?ge.clone():h.normalize(),f=new me(p.x*.72,p.y*1.12+.16),w=f.lengthSq()<1e-4?p.clone():f.normalize(),S=new v(o).lerp(new v("#ffffff"),.62);return a.jsx(at,{follow:!0,children:a.jsxs("mesh",{renderOrder:2,children:[a.jsx("planeGeometry",{args:[c,c,1,1]}),a.jsx("atmosphereGlowMaterial",{glowColor:o,accentColor:S,innerRadius:u,outerRadius:m,lightDirection:p,crestDirection:w,intensity:r,edgeSoftness:1.05,transparent:!0,depthWrite:!1,depthTest:!1,blending:N,toneMapped:!1})]})})}const oe={coordinate:{latitude:1.3521,longitude:103.8198},color:"#90d5ff"},ie=[{id:"signal-cinder",slug:"cinder",coordinate:{latitude:34.0522,longitude:-118.2437},color:"#90d5ff",phase:.08,speed:.075,lift:.18},{id:"signal-sit-open-house-2026",slug:"sit-open-house-2026",coordinate:{latitude:35.6762,longitude:139.6503},color:"#73ffd9",phase:.42,speed:.068,lift:.13},{id:"signal-betadine-sore-throat-lozenges",slug:"betadine-sore-throat-lozenges",coordinate:{latitude:-33.8688,longitude:151.2093},color:"#cbeeff",phase:.68,speed:.058,lift:.15}],Ee=[{id:"rnd-shophouse-generator",slug:"shophouse-generator",coordinate:{latitude:22.3193,longitude:114.1694},color:"#90d5ff",phase:.18,speed:.2,lift:.08},{id:"rnd-webgl-lab",slug:"webgl-lab",coordinate:{latitude:52.52,longitude:13.405},color:"#73ffd9",phase:.52,speed:.17,lift:.12},{id:"rnd-ai-node-sketch",slug:"ai-node-sketch",coordinate:{latitude:37.7749,longitude:-122.4194},color:"#cbeeff",phase:.78,speed:.22,lift:.16}],re=[{id:"workflow-discover",color:"#90d5ff",radiusMultiplier:1.165,tubeRadius:.0017,speed:.035,opacity:.22,phase:.1,tilt:[63,-18,12]},{id:"workflow-prototype",color:"#73ffd9",radiusMultiplier:1.205,tubeRadius:.0014,speed:-.026,opacity:.16,phase:.36,tilt:[78,28,-22]},{id:"workflow-polish",color:"#cbeeff",radiusMultiplier:1.245,tubeRadius:.0012,speed:.019,opacity:.13,phase:.64,tilt:[54,74,35]}];function Ce({color:e,delay:t,opacity:n,speed:r}){const o=d.useRef(null),i=d.useRef(null);return G(({clock:l})=>{if(!o.current||!i.current)return;const c=x.euclideanModulo(l.elapsedTime*r+t,1),u=Math.pow(1-c,1.35),m=x.lerp(.55,1.42,c);o.current.scale.setScalar(m),i.current.opacity=n*u}),a.jsxs("mesh",{ref:o,rotation:[-Math.PI/2,0,0],position:[0,.006,0],renderOrder:3,children:[a.jsx("ringGeometry",{args:[.03,.034,48]}),a.jsx("meshBasicMaterial",{ref:i,color:e,transparent:!0,opacity:n,side:ze,depthWrite:!1,blending:N,toneMapped:!1})]})}function Vt({radius:e,opacityScale:t,speedScale:n}){const r=d.useMemo(()=>bt(oe.coordinate,e*1.006),[e]),o=d.useMemo(()=>new v(oe.color).lerp(new v("#ffffff"),.22),[]);return a.jsxs("group",{position:r.position,quaternion:r.quaternion,children:[a.jsxs("mesh",{position:[0,.009,0],renderOrder:4,children:[a.jsx("sphereGeometry",{args:[.0125,18,18]}),a.jsx("meshBasicMaterial",{color:o,transparent:!0,opacity:.72*t,depthWrite:!1,blending:N,toneMapped:!1})]}),a.jsx(Ce,{color:o,delay:0,opacity:.34*t,speed:.45*n}),a.jsx(Ce,{color:o,delay:.48,opacity:.22*t,speed:.45*n})]})}const De=new _(-.11,.11,.11).normalize(),qt=new v("#050816"),Wt=we({litColor:new v("#4d63ff"),shadowColor:new v("#110828"),fresnelColor:new v("#56b8ff"),lightDirection:De,sunFalloff:1.2,opacity:.62},`
    varying vec3 vWorldNormal;
    varying vec3 vViewDirection;

    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      vViewDirection = normalize(cameraPosition - worldPosition.xyz);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,`
    uniform vec3 litColor;
    uniform vec3 shadowColor;
    uniform vec3 fresnelColor;
    uniform vec3 lightDirection;
    uniform float sunFalloff;
    uniform float opacity;

    varying vec3 vWorldNormal;
    varying vec3 vViewDirection;

    void main() {
      vec3 normal = normalize(vWorldNormal);
      vec3 viewDirection = normalize(vViewDirection);
      float lightDot = dot(normal, normalize(lightDirection));
      float daylight = pow(clamp(lightDot * 0.5 + 0.5, 0.0, 1.0), max(sunFalloff, 0.0001));
      float light = smoothstep(0.08, 0.9, daylight);
      float horizon = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.05);
      float litRim = horizon * smoothstep(0.18, 0.98, daylight);
      float shadowRim = horizon * smoothstep(0.1, 0.96, 1.0 - daylight);
      float baseFresnel = smoothstep(0.18, 0.98, horizon);
      vec3 color = mix(shadowColor, litColor, light);
      color = mix(
        color,
        fresnelColor,
        clamp(baseFresnel * 0.18 + litRim * 0.4 + shadowRim * 0.54, 0.0, 1.0)
      );
      float alpha = opacity * (0.74 + baseFresnel * 0.26);
      gl_FragColor = vec4(color, alpha);
    }
  `);Se({PlanetBodyMaterial:Wt});function kt({radius:e,planetColor:t,glowColor:n,sunDirection:r,sunFalloff:o}){const i=new _(...r),l=i.lengthSq()<1e-4?De.clone():i.normalize(),c=new v(t),u=c.clone().multiplyScalar(.22).lerp(qt,.55);return a.jsxs("mesh",{renderOrder:0,children:[a.jsx("sphereGeometry",{args:[e,96,96]}),a.jsx("planetBodyMaterial",{litColor:c,shadowColor:u,fresnelColor:n,lightDirection:l,sunFalloff:o,transparent:!0,depthWrite:!1,toneMapped:!1})]})}const U={radius:1.12,shellRadius:1.1648,pointSize:.0215,sampleCount:76e3,landThreshold:1,terrainHeightScale:.04,dragRotateSpeed:10.8},O={minimumInertiaVelocity:.08,idleAutoRotateSpeed:.04,axisReturnStrength:5.4,axisReturnAngleThreshold:.003},Te=1.55,Ut=12e3,Ht=14e4,$t=we({color:new v("#afc9ff"),pointSize:.019,pointScale:338,frontOpacity:.8,backOpacity:.096,minPointSize:Te},`
    uniform float pointSize;
    uniform float pointScale;
    uniform float frontOpacity;
    uniform float backOpacity;
    uniform float minPointSize;

    attribute vec3 particleNormal;
    attribute float particleSeed;
    attribute float particleHeight;

    varying float vOpacity;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vec3 viewNormal = normalize(normalMatrix * particleNormal);
      float facing = smoothstep(-0.2, 0.55, viewNormal.z);
      float sizeJitter = mix(0.94, 1.14, particleSeed);
      float alphaJitter = mix(0.9, 1.0, particleSeed);
      float silhouetteThreshold = sqrt(max(0.0, 1.0 - 1.0 / pow(1.0 + particleHeight, 2.0)));
      float silhouetteMask = smoothstep(
        silhouetteThreshold,
        silhouetteThreshold + 0.08,
        abs(viewNormal.z)
      );
      float heightInfluence = smoothstep(0.002, 0.018, particleHeight);
      float pointVisibility = mix(1.0, silhouetteMask, heightInfluence);

      vOpacity = mix(backOpacity, frontOpacity, facing) * alphaJitter * pointVisibility;
      float renderedPointSize = max(
        minPointSize,
        pointSize * pointScale * sizeJitter / max(-mvPosition.z, 0.0001)
      );
      gl_PointSize = renderedPointSize * pointVisibility;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,`
    uniform vec3 color;

    varying float vOpacity;

    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      float alpha = (1.0 - smoothstep(0.26, 0.5, dist)) * vOpacity;

      if (alpha <= 0.0) {
        discard;
      }

      gl_FragColor = vec4(color, alpha);
    }
  `),Xt=e=>{switch(e){case"screen":return{blending:he,blendSrc:pe,blendDst:xt,blendEquation:Q,blendSrcAlpha:$,blendDstAlpha:de,blendEquationAlpha:Q};case"lighten":return{blending:he,blendSrc:pe,blendDst:$,blendEquation:gt,blendSrcAlpha:$,blendDstAlpha:de,blendEquationAlpha:Q};case"darken":return{blending:he,blendSrc:pe,blendDst:$,blendEquation:ft,blendSrcAlpha:$,blendDstAlpha:de,blendEquationAlpha:Q};case"additive":return{blending:N};case"subtractive":return{blending:mt};case"multiply":return{blending:ht};default:return{blending:pt}}};function Yt(e,t){const n=Math.max(.01,t),r=Math.round(e/(n*n));return x.clamp(r,Ut,Ht)}Se({GlobeParticleMaterial:$t});function Zt({rotationX:e,rotationY:t,cameraZ:n,radius:r,pointSize:o,terrainHeightScale:i,particleOpacity:l,particleSizeScale:c,particleSeparation:u,particleColor:m,particleBlendMode:h}){const p=d.useRef(null),f=d.useRef(null),w=st("./earth-elevation.png"),S=Xt(h),z=d.useMemo(()=>Yt(U.sampleCount,u),[u]),B=o*c,j=Math.max(.7,Te*c),R=d.useMemo(()=>{const C=zt(w);return It(C,{radius:r,sampleCount:z,landThreshold:U.landThreshold,terrainHeightScale:i})},[w,r,z,i]);return d.useEffect(()=>{f.current=R;const C=new K(R.positions,3),L=new K(R.normals,3),I=new K(R.seeds,1),E=new K(R.heights,1),A=p.current;A&&(A.setAttribute("position",C),A.setAttribute("particleNormal",L),A.setAttribute("particleSeed",I),A.setAttribute("particleHeight",E),A.computeBoundingSphere())},[R]),G(()=>{const C=f.current;C&&ye({particleCount:C.count,averageDisplacement:0,rotationX:e,rotationY:t,cameraZ:n,pointerHitEarth:!1,velocity:0})}),a.jsxs("points",{renderOrder:1,children:[a.jsx("bufferGeometry",{ref:p}),a.jsx("globeParticleMaterial",{color:m,pointSize:B,pointScale:338,frontOpacity:l,backOpacity:Math.max(.02,l*.12),minPointSize:j,transparent:!0,depthWrite:!1,toneMapped:!1,...S})]})}function Jt(e,t){const r=x.euclideanModulo(t,1)*(e.length-1),o=Math.floor(r),i=Math.min(e.length-1,o+1),l=r-o;return e[o].clone().lerp(e[i],l)}function je({points:e,color:t,opacity:n,renderOrder:r=2,activityRef:o}){const i=d.useRef(null),l=d.useMemo(()=>{const c=new wt().setFromPoints(e),u=new St({color:t,transparent:!0,opacity:o?0:n,depthWrite:!1,blending:N,toneMapped:!1}),m=new yt(c,u);return m.renderOrder=r,m},[o,t,n,e,r]);return G(()=>{i.current&&o&&(i.current.opacity=n*o.current)}),d.useEffect(()=>(i.current=l.material,()=>{i.current=null,l.geometry.dispose(),l.material.dispose()}),[l]),a.jsx("primitive",{object:l})}function Fe({points:e,color:t,size:n,opacity:r,speed:o,phase:i,renderOrder:l=3,activityRef:c}){const u=d.useRef(null),m=d.useRef(null),h=d.useMemo(()=>new v(t),[t]);return G(({clock:p})=>{if(!u.current||!m.current)return;const f=p.elapsedTime*o+i,w=Jt(e,f),S=Math.sin(x.euclideanModulo(f,1)*Math.PI),z=c?.current??1;u.current.position.copy(w),u.current.scale.setScalar(x.lerp(.72,1.26,S)),m.current.opacity=r*z*x.lerp(.55,1,S)}),a.jsxs("mesh",{ref:u,renderOrder:l,children:[a.jsx("sphereGeometry",{args:[n,12,12]}),a.jsx("meshBasicMaterial",{ref:m,color:h,transparent:!0,opacity:c?0:r,depthWrite:!1,blending:N,toneMapped:!1})]})}function Kt({radius:e,isMobileMode:t,opacityScale:n,speedScale:r}){const o=d.useMemo(()=>(t?ie.slice(0,2):ie).map(m=>({signal:m,points:Ie(oe.coordinate,m.coordinate,e*1.012,e*m.lift,t?52:72)})),[t,e]),i=(t?.16:.26)*n,l=(t?.48:.68)*n,c=e*(t?.007:.0085);return a.jsx("group",{children:o.map(({signal:u,points:m})=>a.jsxs("group",{children:[a.jsx(je,{points:m,color:u.color,opacity:i}),a.jsx(Fe,{points:m,color:u.color,size:c,opacity:l,speed:u.speed*r,phase:u.phase})]},u.id))})}function Qt({radius:e,isInteracting:t,isMobileMode:n,opacityScale:r,speedScale:o}){const i=d.useRef(0),l=d.useMemo(()=>Ee.map(h=>({signal:h,points:Ie(oe.coordinate,h.coordinate,e*1.02,e*h.lift,n?36:54)})),[n,e]),c=(n?.12:.2)*r,u=(n?.42:.62)*r,m=e*(n?.006:.0075);return G((h,p)=>{const f=t?1:0,w=1-Math.exp(-5.8*p);i.current+=(f-i.current)*w}),a.jsx("group",{children:l.map(({signal:h,points:p})=>a.jsxs("group",{children:[a.jsx(je,{points:p,color:h.color,opacity:c,renderOrder:3,activityRef:i}),a.jsx(Fe,{points:p,color:h.color,size:m,opacity:u,speed:h.speed*o,phase:h.phase,renderOrder:4,activityRef:i})]},h.id))})}function en({orbit:e,radius:t,opacityScale:n,speedScale:r}){const o=d.useRef(null),[i,l,c]=d.useMemo(()=>e.tilt.map(p=>x.degToRad(p)),[e.tilt]),u=d.useMemo(()=>new v(e.color),[e.color]),m=t*e.radiusMultiplier,h=Math.max(t*e.tubeRadius,.001);return G(({clock:p})=>{if(!o.current)return;const f=p.elapsedTime*e.speed*r+e.phase*Math.PI*2;o.current.rotation.set(i,l+f,c+f*.38)}),a.jsx("group",{ref:o,children:a.jsxs("mesh",{renderOrder:2,children:[a.jsx("torusGeometry",{args:[m,h,8,160]}),a.jsx("meshBasicMaterial",{color:u,transparent:!0,opacity:e.opacity*n,depthWrite:!1,blending:N,toneMapped:!1})]})})}function tn({radius:e,isMobileMode:t,opacityScale:n,speedScale:r}){const o=t?re.slice(0,1):re;return a.jsx("group",{children:o.map(i=>a.jsx(en,{orbit:i,radius:e,opacityScale:t?n*.55:n,speedScale:r},i.id))})}const nn=34;function on(e,t){return{width:Math.max(e,360),height:Math.max(t,360)}}function rn(e,t,n){const r=on(e,t),o=Math.min(r.width,r.height),i=Math.min(1,r.width/r.height),l=Math.min(.92,Math.max(.68,o/1120)),c=Number((n.radius*l).toFixed(4)),u=n.shellRadius/n.radius,m=Number((c*u).toFixed(4)),h=Number((n.pointSize*Math.max(.78,l*.94)).toFixed(4)),p=o<560?.5:o<860?.56:.6,f=Math.tan(nn*Math.PI/360),w=Number((c/(p*f*i)).toFixed(4));return{radius:c,shellRadius:m,pointSize:h,cameraZ:w,offsetX:0}}const an=new _(-.1,.11,.11).normalize();function sn({rotation:e,isInteracting:t,isMobileMode:n,terrainHeightScale:r,glowDistance:o,glowStrength:i,glowColor:l,planetColor:c,particleOpacity:u,particleSizeScale:m,particleSeparation:h,particleColor:p,particleBlendMode:f,cityGlowColor:w,cityGlowSize:S,cityGlowStrength:z,cityGlowSizeVariance:B,singaporeGlowSize:j,singaporeGlowStrength:R,sunDirection:C,sunFalloff:L,signalLayerOpacity:I,signalLayerSpeed:E}){const{camera:A,size:F}=lt(),D=d.useRef(null),y=d.useMemo(()=>rn(F.width,F.height,U),[F.height,F.width]),P=(()=>{const X=new _(...C);return X.lengthSq()<1e-4?an.clone():X.normalize()})(),ae=[P.x*5,P.y*5,P.z*5],se=[-P.x*3.2,-P.y*2.1,-P.z*3.2];return d.useLayoutEffect(()=>{A.position.set(0,0,y.cameraZ),A.updateProjectionMatrix()},[A,y.cameraZ]),d.useEffect(()=>{ye({projectSignalCount:n?Math.min(2,ie.length):ie.length,rndSignalCount:Ee.length,workflowOrbitCount:n?Math.min(1,re.length):re.length,homeBasePulseCount:1,signalLayerInteracting:t})},[t,n]),G(()=>{D.current&&(D.current.rotation.set(e.x,e.y,0),D.current.position.set(y.offsetX,0,0))}),a.jsxs(a.Fragment,{children:[a.jsx("ambientLight",{intensity:.52}),a.jsx("directionalLight",{position:ae,intensity:.82,color:"#b6d7ff"}),a.jsx("directionalLight",{position:se,intensity:.22,color:"#73ffd9"}),a.jsxs("group",{ref:D,children:[a.jsx(kt,{radius:y.radius*.999,planetColor:c,glowColor:l,sunDirection:C,sunFalloff:L}),a.jsx(Zt,{rotationX:e.x,rotationY:e.y,cameraZ:y.cameraZ,radius:y.radius,pointSize:y.pointSize,terrainHeightScale:r,particleOpacity:u,particleSizeScale:m,particleSeparation:h,particleColor:p,particleBlendMode:f}),a.jsx(Nt,{radius:y.radius,glowColor:w,glowSize:S,glowStrength:z,sizeVariance:B,singaporeGlowSize:j,singaporeGlowStrength:R}),a.jsx(Vt,{radius:y.radius,opacityScale:I,speedScale:E}),a.jsx(Kt,{radius:y.radius,isMobileMode:n,opacityScale:I,speedScale:E}),a.jsx(Qt,{radius:y.radius,isInteracting:t,isMobileMode:n,opacityScale:I,speedScale:E}),a.jsx(tn,{radius:y.radius,isMobileMode:n,opacityScale:I,speedScale:E}),a.jsx(Gt,{globeRadius:y.radius,radius:y.shellRadius,glowDistance:o,glowStrength:i,glowColor:l,sunDirection:C})]})]})}const Ae={latitude:1.3521,longitude:103.8198},xe=Rt(Ae.latitude,Ae.longitude),ee=xe.x,ln={width:0,height:0},te={x:0,y:0};function cn(){const e=typeof window<"u"?new URLSearchParams(window.location.search):null,t=e?.get("embed")==="1",n=e?.get("mobile")==="1",r=n?.58:.64,o=n?1.9:2.4,i=n?1.8:1.4,l=d.useRef(null),c=d.useRef(null),u=d.useRef({...te}),m=d.useRef(null),h=d.useRef(null),p=d.useRef(null),f=d.useRef(null),[w,S]=d.useState(ln),[z,B]=d.useState(xe),j=d.useRef({...xe}),[R,C]=d.useState(!1),{heroGradientColor:L,heroGradientLength:I}=ue("Hero Background",{heroGradientColor:"#0d3b8b",heroGradientLength:{value:64,min:8,max:100,step:1}}),{terrainHeight:E,glowDistance:A,glowStrength:F,glowColor:D,planetColor:y,particleOpacity:P,particleSize:ae,particleSeparation:se,particleColor:X,particleBlendMode:Oe,cityGlowColor:_e,cityGlowSize:Ne,cityGlowStrength:Be,cityGlowSizeVariance:Le,singaporeGlowSize:Ge,singaporeGlowStrength:Ve,sunX:qe,sunY:We,sunZ:ke,sunFalloff:Ue}=ue("Particle Globe",{terrainHeight:{value:U.terrainHeightScale,min:0,max:.35,step:.005},glowDistance:{value:.51,min:.08,max:.6,step:.005},glowStrength:{value:.57,min:.2,max:1.8,step:.01},glowColor:"#56b8ff",planetColor:"#1e9aff",particleOpacity:{value:r,min:.1,max:1,step:.01},particleSize:{value:o,min:.7,max:2.4,step:.01},particleSeparation:{value:i,min:.7,max:2.5,step:.01},particleColor:"#afc9ff",particleBlendMode:{value:"normal",options:{Normal:"normal",Screen:"screen",Additive:"additive",Lighten:"lighten",Darken:"darken",Multiply:"multiply",Subtractive:"subtractive"}},cityGlowColor:"#56b8ff",cityGlowSize:{value:.57,min:.35,max:2.2,step:.01},cityGlowStrength:{value:.9,min:0,max:2.2,step:.01},cityGlowSizeVariance:{value:1,min:0,max:2,step:.01},singaporeGlowSize:{value:1,min:.2,max:3,step:.01},singaporeGlowStrength:{value:1,min:0,max:3,step:.01},sunX:{value:-.1,min:-2,max:2,step:.01},sunY:{value:.11,min:-2,max:2,step:.01},sunZ:{value:.11,min:-2,max:2,step:.01},sunFalloff:{value:1.56,min:.35,max:3,step:.01}}),{signalLayerOpacity:He,signalLayerSpeed:$e}=ue("Signal Layers",{signalLayerOpacity:{value:n?.58:.74,min:0,max:1.5,step:.01},signalLayerSpeed:{value:1,min:.1,max:2,step:.01}}),Xe={"--hero-gradient-color":L,"--hero-gradient-length":`${I}%`},H=d.useCallback(s=>{B(g=>{const b=s(g);return j.current=b,b})},[]),le=d.useCallback(()=>{m.current!==null&&(window.cancelAnimationFrame(m.current),m.current=null),h.current=null},[]),Y=d.useCallback(()=>{p.current!==null&&(window.cancelAnimationFrame(p.current),p.current=null),f.current=null},[]),Z=d.useCallback(()=>{if(p.current!==null||c.current||m.current!==null)return;const s=g=>{const b=f.current;if(f.current=g,c.current||m.current!==null){p.current=null,f.current=null;return}if(b!==null){const M=Math.max((g-b)/1e3,.004166666666666667);H(T=>({x:T.x,y:T.y+O.idleAutoRotateSpeed*M}))}p.current=window.requestAnimationFrame(s)};p.current=window.requestAnimationFrame(s)},[H]),Ye=()=>{if(m.current!==null)return;Y();const s=g=>{const b=h.current;if(h.current=g,b!==null){const M=Math.max((g-b)/1e3,.004166666666666667),T=u.current,V=j.current,J=V.x-ee,q=(T.x-J*O.axisReturnStrength*M)*Math.exp(-3.8*M),W=T.y*Math.exp(-2.4*M),k={x:V.x+q*M,y:V.y+W*M},nt=Math.abs(q)<O.axisReturnAngleThreshold&&Math.abs(k.x-ee)<O.axisReturnAngleThreshold,ot=Math.abs(W)<O.minimumInertiaVelocity;if(nt&&ot){u.current={...te},H(()=>({x:ee,y:k.y})),m.current=null,h.current=null,Z();return}u.current={x:q,y:W},H(()=>k)}m.current=window.requestAnimationFrame(s)};m.current=window.requestAnimationFrame(s)};d.useEffect(()=>{const s=l.current;if(!s)return;const g=()=>{const M=s.getBoundingClientRect();S({width:M.width,height:M.height})};g();const b=new ResizeObserver(g);return b.observe(s),()=>{b.disconnect()}},[]),d.useEffect(()=>(Z(),()=>{le(),Y()}),[Z,Y,le]),d.useEffect(()=>{const s=t?"true":"false";return document.documentElement.dataset.embed=s,document.body.dataset.embed=s,()=>{delete document.documentElement.dataset.embed,delete document.body.dataset.embed}},[t]);const Me=(s,g,b)=>{const M=c.current;if(!M)return;const T=s-M.origin.x,V=g-M.origin.y,J=Math.max((b-M.origin.time)/1e3,1/240);if(c.current={...M,origin:{x:s,y:g,time:b}},!T&&!V)return;const q=V/Math.max(w.height,1)*U.dragRotateSpeed,W=T/Math.max(w.width,1)*U.dragRotateSpeed;u.current={x:q/J,y:W/J},H(k=>({x:k.x+q,y:k.y+W}))},ce=()=>{if(c.current=null,C(!1),Math.abs(u.current.x)>=O.minimumInertiaVelocity||Math.abs(u.current.y)>=O.minimumInertiaVelocity||Math.abs(j.current.x-ee)>=O.axisReturnAngleThreshold){Ye();return}u.current={...te},Z()},ve=(s,g,b,M,T)=>(le(),Y(),u.current={...te},c.current={input:s,pointerId:g,origin:{x:b,y:M,time:T}},C(!0),!0),Ze=s=>{ve("mouse",null,s.clientX,s.clientY,s.timeStamp),s.preventDefault(),s.stopPropagation()},Je=s=>{const g=c.current;!g||g.input!=="mouse"||(Me(s.clientX,s.clientY,s.timeStamp),s.preventDefault(),s.stopPropagation())},Ke=s=>{const g=c.current;!g||g.input!=="mouse"||(ce(),s.preventDefault(),s.stopPropagation())},Qe=s=>{s.pointerType!=="mouse"&&(ve("pointer",s.pointerId,s.clientX,s.clientY,s.timeStamp),s.currentTarget.setPointerCapture(s.pointerId),s.preventDefault(),s.stopPropagation())},et=s=>{const g=c.current;s.pointerType==="mouse"||!g||g.input!=="pointer"||g.pointerId!==s.pointerId||(Me(s.clientX,s.clientY,s.timeStamp),s.preventDefault(),s.stopPropagation())},Re=s=>{const g=c.current;s.pointerType==="mouse"||!g||g.input!=="pointer"||g.pointerId!==s.pointerId||(s.currentTarget.hasPointerCapture(s.pointerId)&&s.currentTarget.releasePointerCapture(s.pointerId),ce(),s.preventDefault(),s.stopPropagation())},tt=s=>{const g=c.current;!g||g.input!=="pointer"||g.pointerId!==s.pointerId||ce()};return a.jsxs("main",{className:`app-shell${t?" app-shell--embed":""}`,style:Xe,children:[t?null:a.jsx(ut,{flat:!0,titleBar:!0,oneLineLabels:!0}),a.jsx("div",{ref:l,className:`scene-frame${R?" is-dragging":""}`,"data-testid":"scene-frame",onMouseDownCapture:Ze,onMouseMoveCapture:Je,onMouseUpCapture:Ke,onPointerDownCapture:Qe,onPointerMoveCapture:et,onPointerUpCapture:Re,onPointerCancelCapture:Re,onLostPointerCapture:tt,children:a.jsxs(ct,{camera:{position:[0,0,4.4],fov:34},dpr:[1,n?1.2:1.75],gl:{antialias:!0,alpha:!0},children:[a.jsx("fog",{attach:"fog",args:["#050816",4.5,9]}),a.jsx(d.Suspense,{fallback:null,children:a.jsx(sn,{rotation:z,isInteracting:R,isMobileMode:n,terrainHeightScale:E,glowDistance:A,glowStrength:F,glowColor:D,planetColor:y,particleOpacity:P,particleSizeScale:ae,particleSeparation:se,particleColor:X,particleBlendMode:Oe,cityGlowColor:_e,cityGlowSize:Ne,cityGlowStrength:Be,cityGlowSizeVariance:Le,singaporeGlowSize:Ge,singaporeGlowStrength:Ve,sunDirection:[qe,We,ke],sunFalloff:Ue,signalLayerOpacity:He,signalLayerSpeed:$e})})]})})]})}it.createRoot(document.getElementById("root")).render(a.jsx(rt.StrictMode,{children:a.jsx(cn,{})}));
