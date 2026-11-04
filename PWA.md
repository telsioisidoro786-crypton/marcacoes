# PWA Marcações

A aplicação já inclui:

- `manifest.webmanifest` para instalação como aplicação;
- ícones PNG em `assets/icon-192.png` e `assets/icon-512.png`;
- `sw.js` com cache do shell público e fallback offline;
- `offline.html` para quando não houver ligação;
- prompt de instalação para Android e instruções para iPhone;
- tratamento de eventos push no service worker.

## Instalar

### Android / Chrome

Abra a página pública ou o painel em HTTPS. Quando aparecer o cartão **Instalar Marcações**, toque em **Instalar aplicação**. Também pode usar o menu do navegador → **Instalar aplicação**.

### iPhone / Safari

Abra o site no Safari, toque em **Partilhar** e escolha **Adicionar ao ecrã principal**. A aplicação passa a abrir em modo standalone.

## Cache e privacidade

O service worker usa uma estratégia network-first para páginas públicas e um fallback offline. Assets estáticos podem ser servidos do cache. O painel `painel.html` não é colocado no cache, evitando guardar a interface privada no dispositivo. Dados de marcações continuam a depender da ligação ao Firebase.

## Push notifications

O service worker já sabe receber e apresentar eventos `push`, mas o envio efetivo exige uma subscrição Web Push com chave pública VAPID e um backend que envie as mensagens. Não foram colocadas chaves VAPID falsas no frontend.

Para ativar esta parte, é necessário:

1. gerar um par de chaves VAPID;
2. expor apenas a chave pública no frontend;
3. chamar `pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })`;
4. guardar a subscrição numa coleção protegida do Firestore;
5. usar uma Cloud Function ou outro backend para enviar as notificações.

No iPhone, as notificações Web Push requerem iOS 16.4 ou superior e a aplicação adicionada ao ecrã principal.
