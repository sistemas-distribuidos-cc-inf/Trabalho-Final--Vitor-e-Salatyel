# Como executar
Serviço de chat - Protótipo de cliente web para servidor IRC utilizando RabbitMQ para desacoplar cliente do servidor tornando mais escalável.


***Antes de rodar programa: 

- Instalar NODEJS (https://nodejs.org/en/download/    -- NPMJS já está incluso no NODEJS);

- Instalar Erlang e rabbitMQ (tutorial p/ Windows: https://www.youtube.com/watch?v=OJ3onEUxBAQ);

- Baixar GIT BASH (p/Windows: https://gitforwindows.org/).

----------------------------------------------------------------

***Passos pra rodar o código no GIT:

1)   git clone https://github.com/sistemas-distribuidos-cc-inf/Trabalho-Final--Vitor-e-Salatyel.git

2)   cd Trabalho-Final--Vitor-e-Salatyel

3)   npm install

4)   node app.js

----------------------------------------------------

***Agora é necessário abrir outro terminal (F+12 no GIT)

5)   cd Trabalho-Final--Vitor-e-Salatyel

6)   cd amqp-irc

7)   node app.js

----------------------------------
***No navegador (browser)

8)   localhost:3000
