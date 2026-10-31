# Sistema de marcações para barbearias (Nexora Systems)

## Ficheiros
- `index.html` — página do cliente (link da barbearia: `teudominio.com/nome-da-barbearia`)
- `painel.html` — painel do dono (`teudominio.com/painel`): login, marcações do dia, nova marcação, personalização
- `firebase-config.js` — **o único ficheiro a editar**: cola aqui os dados do teu projeto Firebase
- `core.js`, `reservas.js` — lógica partilhada
- `firestore.rules` — regras de segurança (colar no Firebase Console)
- `vercel.json` / `_redirects` — links curtos (Vercel / Netlify)

## Configurar o Firebase (uma vez)
1. console.firebase.google.com → **Adicionar projeto**.
2. **Build → Firestore Database → Criar base de dados** (modo produção; região `europe-west` é a mais próxima de Angola).
3. **Build → Authentication → Começar → Email/Palavra-passe → Ativar**.
4. **Firestore → Regras**: apagar tudo, colar o conteúdo de `firestore.rules`, **Publicar**.
5. **Definições do projeto (⚙) → As suas apps → Web (`</>`)**: registar a app e copiar o `firebaseConfig`. Colar os valores em `firebase-config.js`.
6. **Authentication → Definições → Domínios autorizados**: adicionar o domínio onde publicares (ex.: `o-teu-site.vercel.app`).

## Publicar
Colocar todos estes ficheiros na raiz de um projeto no Vercel ou Netlify (não funciona abrindo o ficheiro diretamente no computador, porque usa módulos JavaScript).

## Usar
1. Abrir `/painel`, **Criar conta** (email + palavra-passe do dono).
2. Criar a barbearia (nome + link) → **Personalizar** → definir WhatsApp, serviços, horário, equipa → **Guardar**.
3. Enviar ao cliente final o link mostrado no topo do painel.

Dica: podes criar todas as barbearias dos teus clientes na tua própria conta (selector no topo do painel) e gerir tudo a partir daí.
