# Notificações de confirmação

O projeto já guarda o email opcional do cliente na marcação. Quando o proprietário muda uma marcação de `pendente` para `confirmada`, o painel cria um documento na fila:

`mail/{id}`

O documento segue o formato compatível com a extensão oficial **Firebase Trigger Email**:

- `slug`: identificação da barbearia proprietária;
- `to`: email do cliente;
- `message.subject`: assunto;
- `message.text`: texto da confirmação;
- `tipo`: `confirmacao`;
- `marcacaoId`: identificação da marcação;
- `criadoEm`: timestamp do Firebase.

## Ativar o envio efetivo

A aplicação web não contém chaves SMTP nem segredos de email. Para enviar as mensagens, instale a extensão **Trigger Email** no Firebase Console:

1. Abra **Firebase Console → Extensions → Explore Hub**.
2. Instale **Trigger Email (firestore-send-email)**.
3. Configure a coleção de emails como `mail`.
4. Configure o servidor SMTP/transacional, por exemplo SendGrid, Mailgun, Brevo ou SMTP próprio.
5. Publique novamente as regras de `firestore.rules` deste repositório.
6. Faça um teste com uma marcação que tenha email e confirme-a no painel.

Sem a extensão e um SMTP configurado, o pedido fica na fila do Firestore, mas nenhum email é enviado. Esta separação evita expor credenciais no navegador.

## SMS

O telefone continua guardado na marcação e o painel mantém o botão de WhatsApp. O envio automático por SMS requer um fornecedor próprio, como Twilio ou Vonage, e uma função backend com segredo. Não foi colocado nenhum token SMS no frontend.
