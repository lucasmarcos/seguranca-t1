# Trabalho Prático 1 – Sistema de Comunicação Segura entre Usuários

## Disciplina: SA28S - Segurança e Auditoria em Sistemas

### Professor: Erinaldo Pereira

Objetivo: Desenvolver uma aplicação prática que simula a troca segura de mensagens entre dois usuários (Alice e Bob), utilizando:
- Hash para verificação de integridade,
- Criptografia simétrica para proteger o conteúdo da mensagem,
- Criptografia assimétrica para troca segura da chave simétrica,
- Assinatura digital para autenticar o remetente,
- Certificado digital simulado para validar a chave pública do remetente.

Fundamentação Teórica:
- Hash (SHA-256): Garante que a mensagem não foi alterada.
- Criptografia Simétrica (AES): Usada para criptografar a mensagem com uma única chave.
- Criptografia Assimétrica (RSA): Usada para proteger a chave simétrica durante a transmissão.
- Assinatura Digital: Garantia de autenticidade da mensagem.
- Certificado Digital: Confirma a identidade do remetente (simulado via JSON, por exem-
plo).

Resultados Esperados: A mensagem será descriptografada corretamente se nenhuma alteração for feita no pacote.
Caso a assinatura não corresponda ou o certificado esteja adulterado, o sistema acusará erro.
Confirma a segurança, integridade e autenticidade.

Equipe: O trabalho poderá ser desenvolvido e apresentado em equipes de até quatro integrantes.

Apresentação: As apresentação do trabalho consistirá na gravação de um vídeo explicando o sistema desenvolvido. Que deverá ser enviado via moodle, o vídeo, e o código completo da  aplicação.
