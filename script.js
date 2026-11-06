const PAIRS=[
 {t:"Asoslar",e:"🍎",w:[["Apple","Olma"],["Water","Suv"],["Book","Kitob"],["House","Uy"],["Bread","Non"]]},
 {t:"Salomlashish",e:"👋",w:[["Hello","Salom"],["Good morning","Xayrli tong"],["Thank you","Rahmat"],["Goodbye","Xayr"],["Please","Iltimos"]]},
 {t:"Oila",e:"👪",w:[["Mother","Ona"],["Father","Ota"],["Brother","Aka"],["Sister","Opa"],["Friend","Doʻst"]]},
 {t:"Ranglar",e:"🎨",w:[["Red","Qizil"],["Blue","Koʻk"],["Green","Yashil"],["Black","Qora"],["White","Oq"]]},
 {t:"Raqamlar",e:"🔢",w:[["One","Bir"],["Two","Ikki"],["Three","Uch"],["Four","Toʻrt"],["Five","Besh"]]}
];
const ALL=PAIRS.flatMap(p=>p.w);
const BOARD=[["🦊","Dilshod",420],["🐼","Madina",360],["🦁","Jasur",290],["🐯","Nodira",210],["🐸","Aziz",150]];
const app=document.getElementById("app");
let S={xp:0,streak:0,last:"",done:[],name:"Siz"},view="learn",hearts=3;
try{Object.assign(S,JSON.parse(localStorage.getItem("tilo")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("tilo",JSON.stringify(S))}catch(e){}};
const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
const today=()=>new Date().toISOString().slice(0,10);

const MENU=[["learn","🏠","Darslar"],["practice","💪","Mashq"],["rank","🏆","Reyting"],["profile","👤","Profil"]];
function shell(html){
 app.innerHTML=`<nav class="nav" aria-label="Asosiy menyu"><div class="logo">tilo</div>${MENU.map(m=>`<button data-v="${m[0]}" class="${view===m[0]?"on":""}" ${view===m[0]?'aria-current="page"':""}><span class="ic">${m[1]}</span><span>${m[2]}</span></button>`).join("")}</nav><main><div class="page">${html}</div></main>`;
 app.querySelectorAll(".nav button").forEach(b=>b.onclick=()=>{view=b.dataset.v;go()});
}
const bar=()=>`<div class="stats"><span class="f">🔥 ${S.streak}</span><span class="x">⚡ ${S.xp}</span><span class="h">❤ 5</span></div>`;

function go(){
 if(view==="learn")learn();else if(view==="practice")practice();else if(view==="rank")rank();else profile();
}
function learn(){
 const next=S.done.filter(Boolean).length,off=[0,40,60,40,0];
 shell(bar()+`<div class="banner"><small>1-BOʻLIM</small><h2>Ingliz tili asoslari</h2></div><div class="path">${PAIRS.map((p,i)=>{
  const st=S.done[i]?"done":i===next?"":"lock";
  return `<div class="step" style="transform:translateX(${off[i%5]}px)"><button class="node ${st}" data-i="${i}" ${st==="lock"?"disabled":""} aria-label="${p.t}">${S.done[i]?"✓":st==="lock"?"🔒":p.e}</button>${p.t}</div>`}).join("")}</div>`);
 app.querySelectorAll(".node").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;start(PAIRS[i].w,i)});
}
function practice(){
 shell(bar()+`<div class="center"><div class="owl">💪</div><h1>Mashq qilish</h1><p style="color:var(--mut);font-size:18px">Barcha oʻrganilgan soʻzlardan aralash savollar.</p><button class="btn" id="p">MASHQNI BOSHLASH</button></div>`);
 document.getElementById("p").onclick=()=>start(shuffle(ALL).slice(0,8),null);
}
function rank(){
 const list=[...BOARD,["🦉",S.name,S.xp]].sort((a,b)=>b[2]-a[2]);
 shell(`<h1>Reyting</h1><div>${list.map((r,i)=>`<div class="row ${r[1]===S.name?"me":""}"><span class="rk">${i+1}</span><span class="av">${r[0]}</span><span class="nm">${r[1]}</span><span>${r[2]} XP</span></div>`).join("")}</div>`);
}
function profile(){
 shell(`<div class="center"><div class="owl">🦉</div><h1>${S.name}</h1></div><div class="grid"><div class="st"><span>🔥 Streak</span><b>${S.streak} kun</b></div><div class="st"><span>⚡ Jami XP</span><b>${S.xp}</b></div><div class="st"><span>✅ Darslar</span><b>${S.done.filter(Boolean).length}/${PAIRS.length}</b></div><div class="st"><span>📚 Soʻzlar</span><b>${ALL.length}</b></div></div><p><button class="btn o" id="r">NATIJALARNI TOZALASH</button></p>`);
 document.getElementById("r").onclick=()=>{if(confirm("Barcha natijalar oʻchiriladi. Davom etasizmi?")){S={xp:0,streak:0,last:"",done:[],name:"Siz"};save();view="learn";go()}};
}

function start(words,idx){
 const qs=shuffle(words).map(([w,a])=>({w,a,o:shuffle([a,...shuffle(ALL.filter(x=>x[1]!==a)).slice(0,3).map(x=>x[1])])}));
 hearts=3;ask(qs,0,0,idx);
}
function ask(qs,i,xp,idx){
 if(hearts<=0)return end(false,xp,qs.length,idx);
 if(i>=qs.length)return end(true,xp,qs.length,idx);
 const L=qs[i];let picked=null,state="ask";
 app.innerHTML=`<div class="lw"><div class="top"><button class="x" id="q" aria-label="Chiqish">✕</button><div class="bar"><div class="fill" style="width:${i/qs.length*100}%"></div></div><span class="hearts" id="hh">❤ ${hearts}</span></div>
 <div class="main"><h1>Bu soʻzni tarjima qiling</h1><div class="q"><button class="say" id="sp" aria-label="Eshitish">🔊</button><span class="word">${L.w}</span></div>
 <div class="opts">${L.o.map(o=>`<button class="opt">${o}</button>`).join("")}</div></div>
 <div class="foot" id="f"><div class="in"><span class="msg" id="m"></span><button class="btn" id="c" disabled>TEKSHIRISH</button></div></div></div>`;
 document.getElementById("q").onclick=()=>go();
 document.getElementById("sp").onclick=()=>{try{const u=new SpeechSynthesisUtterance(L.w);u.lang="en-US";speechSynthesis.speak(u)}catch(e){}};
 const opts=[...app.querySelectorAll(".opt")],c=document.getElementById("c");
 opts.forEach(b=>b.onclick=()=>{if(state!=="ask")return;opts.forEach(x=>x.classList.remove("sel"));b.classList.add("sel");picked=b.textContent;c.disabled=false});
 c.onclick=()=>{
  if(state==="ask"){
   state="done";const ok=picked===L.a,f=document.getElementById("f"),m=document.getElementById("m");
   f.className="foot "+(ok?"ok":"no");
   if(ok){xp+=10;m.textContent="Ajoyib! 🎉"}else{hearts--;m.innerHTML=`Toʻgʻri javob:<small>${L.a}</small>`}
   document.getElementById("hh").textContent="❤ "+hearts;c.textContent="DAVOM ETISH";
  }else ask(qs,i+1,xp,idx);
 };
}
function end(win,xp,n,idx){
 if(win){
  S.xp+=xp;if(idx!==null)S.done[idx]=true;
  if(S.last!==today()){const y=new Date(Date.now()-864e5).toISOString().slice(0,10);S.streak=S.last===y?S.streak+1:1;S.last=today()}
  save();
 }
 app.innerHTML=`<div class="lw"><div class="main center" style="padding-top:8vh"><div class="owl">${win?"🏆":"💔"}</div><h1>${win?"Dars tugadi!":"Jonlar tugadi"}</h1>
 ${win?`<div class="grid"><div class="st"><span style="color:var(--gold)">XP</span><b>+${xp}</b></div><div class="st"><span style="color:var(--green)">ANIQLIK</span><b>${Math.round(xp/(n*10)*100)}%</b></div></div>`:""}</div>
 <div class="foot"><div class="in"><button class="btn w" id="b">${win?"DAVOM ETISH":"MENYUGA QAYTISH"}</button></div></div></div>`;
 document.getElementById("b").onclick=go;
}
go();
