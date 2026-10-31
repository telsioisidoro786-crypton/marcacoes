/* Núcleo partilhado: configuração por barbearia, validação, disponibilidade. Sem dependência do Firebase. */

export const MSG_DEFAULT = "Olá! Quero marcar na {negocio}:\n• Serviço: {servico} ({preco})\n• Barbeiro: {barbeiro}\n• Data: {data} às {hora}\n• Nome: {nome}\n• Contacto: {contacto}";
export const DIAS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
export const CEL = 15; // granularidade da agenda, em minutos

export const DEFAULT = {
  nome:"Minha Barbearia", sub:"Marque o seu corte em 1 minuto", whatsapp:"244900000000",
  logo:"", capa:"", cor:"#f5f5f5", tema:"escuro", fonte:"moderna", cantos:"suave",
  telefone:"", endereco:"", maps:"", instagram:"", facebook:"",
  aviso:"", pagamento:"", politica:"", msg:MSG_DEFAULT,
  servicos:[
    {nome:"Corte simples",desc:"",min:30,preco:2000,promo:0},
    {nome:"Corte + barba",desc:"",min:60,preco:3500,promo:0},
    {nome:"Barba",desc:"",min:30,preco:1500,promo:0},
    {nome:"Sobrancelha",desc:"",min:30,preco:500,promo:0}
  ],
  barbeiros:[{id:"b1",nome:"Barbeiro 1",folgas:[]},{id:"b2",nome:"Barbeiro 2",folgas:[]}]
};

/* ---------- utilitários ---------- */
export const $ = id => document.getElementById(id);
export const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const kz = n => Number(n).toLocaleString("pt-AO") + " Kz";
export const pad = n => String(n).padStart(2,"0");
export const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
export const hoje = () => iso(new Date());
export const toM = t => { const [h,m]=t.split(":").map(Number); return h*60+m; };
export const hhmm = m => `${pad(Math.floor(m/60))}:${pad(m%60)}`;
export const fmtData = s => s.split("-").reverse().join("/");
export const dowDe = s => { const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d).getDay(); };
export const urlOk = v => /^https?:\/\//i.test(v||"") ? String(v).slice(0,500) : "";
export const social = (v,base) => {
  v=(v||"").trim(); if(!v) return ""; if(/^https?:\/\//i.test(v)) return v.slice(0,500);
  const h=v.replace(/^@/,"").replace(/[^A-Za-z0-9._-]/g,""); return h?base+h:"";
};
export const novoId = () => (Math.random().toString(36)+"000000").slice(2,8);
export const slugOk = s => /^[a-z0-9-]{3,40}$/.test(s) && !["painel","index","admin","api","assets"].includes(s);
export const waNum = t => { const d=String(t||"").replace(/\D/g,""); return d.length===9 ? "244"+d : d; };
export const duracao = min => Math.ceil(min/CEL)*CEL;

/* valida tudo o que vem da base de dados ou de importações (nunca confiar) */
export function limpar(c){
  c=c||{}; const d=DEFAULT, o={};
  const txt=(v,def,n)=>String(v??def).slice(0,n);
  const hOk=t=>/^\d{2}:\d{2}$/.test(t||"");
  o.nome=txt(c.nome,d.nome,60); o.sub=txt(c.sub,d.sub,100);
  o.whatsapp=String(c.whatsapp??d.whatsapp).replace(/\D/g,"");
  o.logo=urlOk(c.logo); o.capa=urlOk(c.capa);
  o.cor=/^#[0-9a-f]{6}$/i.test(c.cor||"")?c.cor:d.cor;
  o.tema=c.tema==="claro"?"claro":"escuro";
  o.fonte=["moderna","elegante","forte"].includes(c.fonte)?c.fonte:"moderna";
  o.cantos=["reto","suave","redondo"].includes(c.cantos)?c.cantos:"suave";
  o.telefone=String(c.telefone||"").replace(/[^\d+]/g,"").slice(0,20);
  o.endereco=txt(c.endereco,"",120); o.maps=urlOk(c.maps);
  o.instagram=txt(c.instagram,"",100); o.facebook=txt(c.facebook,"",100);
  o.aviso=txt(c.aviso,"",200); o.pagamento=txt(c.pagamento,"",300); o.politica=txt(c.politica,"",300);
  o.msg=txt(c.msg||MSG_DEFAULT,MSG_DEFAULT,600);
  if(Array.isArray(c.horario)&&c.horario.length===7){
    o.horario=c.horario.map(h=>({on:!!(h&&h.on),abre:hOk(h&&h.abre)?h.abre:"09:00",fecha:hOk(h&&h.fecha)?h.fecha:"18:00"}));
  }else{
    const ab=hOk(c.abre)?c.abre:"09:00", fe=hOk(c.fecha)?c.fecha:"18:00";
    const abertos=Array.isArray(c.diasAbertos)?c.diasAbertos.map(Number):[1,2,3,4,5,6];
    o.horario=[0,1,2,3,4,5,6].map(i=>({on:abertos.includes(i),abre:ab,fecha:fe}));
  }
  o.pausaIni=hOk(c.pausaIni)?c.pausaIni:""; o.pausaFim=hOk(c.pausaFim)?c.pausaFim:"";
  o.passo=[15,30,45,60].includes(+c.passo)?+c.passo:30;
  o.antecedencia=[0,30,60,120,240,1440].includes(+c.antecedencia)?+c.antecedencia:60;
  o.diasVisiveis=[7,14,30].includes(+c.diasVisiveis)?+c.diasVisiveis:7;
  o.fechados=(Array.isArray(c.fechados)?c.fechados:[]).filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)).slice(0,60);
  o.servicos=(Array.isArray(c.servicos)?c.servicos:d.servicos).slice(0,20).map(s=>({
    nome:String(s.nome||"").slice(0,50), desc:String(s.desc||"").slice(0,80),
    min:Math.min(180,Math.max(CEL,duracao(+s.min||30))), preco:Math.max(0,+s.preco||0), promo:Math.max(0,+s.promo||0)}));
  const usados=new Set();
  o.barbeiros=(Array.isArray(c.barbeiros)?c.barbeiros:d.barbeiros).slice(0,10).map((b,i)=>{
    const obj=b&&typeof b==="object";
    let id=obj&&/^[a-z0-9]{2,12}$/.test(b.id||"")?b.id:"b"+(i+1);
    if(id==="qq"||id==="geral"||usados.has(id)) id=novoId();
    usados.add(id);
    return {id, nome:String(obj?b.nome||"":b||"").slice(0,40),
            folgas:obj&&Array.isArray(b.folgas)?b.folgas.map(Number).filter(n=>n>=0&&n<=6):[]};
  });
  return o;
}

/* ---------- tema ---------- */
export function aplicarTema(cfg){
  const r=document.documentElement.style, claro=cfg.tema==="claro";
  r.setProperty("--acc",cfg.cor);
  r.setProperty("--bg",claro?"#f6f6f3":"#090909");
  r.setProperty("--card",claro?"#ffffff":"#151515");
  r.setProperty("--line",claro?"#deded8":"#2d2d2d");
  r.setProperty("--txt",claro?"#161616":"#f2f2f2");
  r.setProperty("--mut",claro?"#6b6b6b":"#9a9a9a");
  r.setProperty("--r",{reto:"3px",suave:"12px",redondo:"22px"}[cfg.cantos]);
  r.setProperty("--fh",{moderna:"system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
                        elegante:"Georgia,'Times New Roman',serif",
                        forte:"'Arial Black',Impact,sans-serif"}[cfg.fonte]);
  document.title="Marcações · "+cfg.nome;
}

/* ---------- serviços e equipa ---------- */
export const final = s => (s.promo>0 && s.promo<s.preco) ? s.promo : s.preco;
export const servicosAtivos = cfg => cfg.servicos.map((s,i)=>({...s,id:"s"+i})).filter(s=>s.nome.trim());
/* barbeiros reais (sem barbeiros definidos, existe um "geral" invisível) */
export function reais(cfg){
  const l=cfg.barbeiros.filter(b=>b.nome.trim());
  return l.length?l:[{id:"geral",nome:"",folgas:[]}];
}
/* lista que o cliente vê (com "Qualquer um" se houver 2 ou mais) */
export function listaBarbeiros(cfg){
  const l=cfg.barbeiros.filter(b=>b.nome.trim());
  return l.length>1?[{id:"qq",nome:"Qualquer um",folgas:[]},...l]:l;
}
const candidatos=(cfg,bid)=>(!bid||bid==="qq")?reais(cfg):reais(cfg).filter(b=>b.id===bid);
export const trabalhaDia=(cfg,bid,dow)=>candidatos(cfg,bid).some(b=>!b.folgas.includes(dow));

/* ---------- agenda ---------- */
export function celulas(m,dur){
  const a=Math.floor(m/CEL), b=Math.ceil((m+dur)/CEL), out=[];
  for(let i=a;i<b;i++) out.push(i*CEL);
  return out;
}
/* oc = Set de "celula|barbeiroId" ocupadas no dia */
export function escolherBarbeiro(cfg,oc,bid,dow,m,dur){
  const cel=celulas(m,dur);
  for(const b of candidatos(cfg,bid)){
    if(b.folgas.includes(dow)) continue;
    if(cel.every(c=>!oc.has(c+"|"+b.id))) return b;
  }
  return null;
}
export function proximosDias(cfg){
  const out=[], h=new Date();
  for(let i=0;out.length<cfg.diasVisiveis && i<120;i++){
    const d=new Date(h.getFullYear(),h.getMonth(),h.getDate()+i);
    if(cfg.horario[d.getDay()].on && !cfg.fechados.includes(iso(d))) out.push(d);
  }
  return out;
}
export function gerarSlots(cfg,dia,min,bid,oc,ignorarAntecedencia){
  const dow=dowDe(dia), hd=cfg.horario[dow];
  if(!hd.on || cfg.fechados.includes(dia)) return [];
  const dur=duracao(min), ab=toM(hd.abre), fi=toM(hd.fecha);
  const pi=(cfg.pausaIni&&cfg.pausaFim)?toM(cfg.pausaIni):null, pf=pi!==null?toM(cfg.pausaFim):null;
  const [y,mo,d]=dia.split("-").map(Number), agora=Date.now(), out=[];
  for(let m=ab;m+min<=fi;m+=cfg.passo){
    if(pi!==null && pf>pi && m<pf && m+min>pi) continue;
    const quando=new Date(y,mo-1,d,Math.floor(m/60),m%60).getTime();
    const livre=!!escolherBarbeiro(cfg,oc,bid,dow,m,dur) && (ignorarAntecedencia || quando-agora>=cfg.antecedencia*60000);
    out.push({h:hhmm(m),m,livre});
  }
  return out;
}
export function setOcupados(snap){
  const s=new Set(); snap.forEach(x=>{ const v=x.data(); s.add(v.c+"|"+v.b); }); return s;
}
export const montarMsg=(tpl,v)=>tpl.replace(/\{(\w+)\}/g,(m,k)=>k in v?v[k]:m);
