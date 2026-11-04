/* Criação de marcações (usada pela página do cliente e pelo painel do dono).
   A marcação e as células de agenda ocupadas são gravadas num único batch (tudo ou nada).
   O ID de cada célula é determinístico (data_minuto_barbeiro): se duas pessoas tentarem o
   mesmo horário, as regras do Firestore recusam a segunda. */
import { db, doc, collection, writeBatch, serverTimestamp } from "./firebase-config.js";
import { toM, escolherBarbeiro, celulas, duracao, dowDe, final } from "./core.js";

export async function criarMarcacao(slug, cfg, oc, p){
  const m=toM(p.hora), dur=duracao(p.servico.min);
  const b=escolherBarbeiro(cfg,oc,p.barbeiro,dowDe(p.dia),m,dur);
  if(!b) throw Object.assign(new Error("ocupado"),{code:"ocupado"});
  const cel=celulas(m,dur), ids=cel.map(c=>`${p.dia}_${c}_${b.id}`);
  const ref=doc(collection(db,"negocios",slug,"marcacoes"));
  const batch=writeBatch(db);
  batch.set(ref,{
    data:p.dia, hora:p.hora, inicio:m, dur,
    servico:p.servico.nome, preco:final(p.servico),
    barbeiroId:b.id, barbeiroNome:b.nome||"",
    cliente:p.cliente.slice(0,60), telefone:(p.telefone||"").slice(0,25), email:(p.email||"").trim().slice(0,120),
    estado:p.estado||"pendente", celulas:ids, criadoEm:serverTimestamp()
  });
  cel.forEach((c,i)=>batch.set(doc(db,"negocios",slug,"ocupados",ids[i]),{data:p.dia,c,b:b.id,mid:ref.id}));
  await batch.commit();
  return {id:ref.id, barbeiro:b};
}
