# Projeto TaskManager

Este projeto apresenta uma aplicação conceitual de escopo definido com o objetivo de demonstrar os conhecimentos de um profissional Full Stack.

A arquitetura está definida em dois módulo, sendo:
- **task-manager-front-end:** Módulo responsável pela camada de visão, utiliza o conceito SPA (*Single Page Application*) com as tecnologias HTML5, CSS3 e JavaScript, utilizando as bibliotecas **JQuery**, **AngularJS** e **Bootstrap**.
- **task-manager-back-end:** Módulo responsável pela camada de negócio e persistência, desenvolvido em Java (jdk1.8) utilizando o framework **Spring Boot**.

Os módulos estão organizados em duas pasta de mesmo nome, sendo eles desenvolvidos para serem executados em instâncias individuais de servidor *http server*.

## Features

- Autenticação para acesso ao sistema;
- Listagem de todas as tarefas disponíveis;
- Visualização dos detalhes de uma tarefa;
- Marcar uma tarefa como minha;
- Completar uma tarefa de minha propriedade;
- Desistir de uma tarefa;
- Criar uma nova tarefa;

# Instalação

## Pré-requisitos
- Possuir o NPM instalado na máquina, caso não tenha, instale o Node.js v6.11.3 disponível no [site](https://docs.npmjs.com/getting-started/installing-node).
- Java SDK v1.8 ([instalação](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html)) configurado com as variáveis de ambientes globais.

## Copiando a aplicação para estação local

- Clone o projeto git usando o comando: git clone https://github.com/humbertosena/task-manager-fullstack.git; **OU**
- Baixe o projeto compactado em formato ZIP para um diretório e descompacte.

Após a descompactação ou clonagem do repositório GitHub para estação local, acesse via linha de comando o diretório criado.

**Obs.:** É recomendado executar dois terminais de linha de comando, um para cada módulo (*front-end* e *back-end*).

# *Build*, Teste e Execução

## Back-end

### *Build*
Acesse o diretório do **Back-end** via terminal de linha de comando.
```sh
$ cd /<diretório do repositório>/task-manager-fullstack/task-manager-backend
$ npm install gradle
```

Para compilar a aplicação, execute o comando abaixo após a instalação do *gradle*
```sh
$ ./gradlew build
```

### Configurações
No módulo de *back-end* através do arquivo **application.properties** é possível configurar:
- server.port: O número da porta do servidor http que será utilizada para responder as requisições dos endpoints da API;
- app.users: Permite realizar a configuração dos usuários disponíveis para autenticação da aplicação.

**Configuração padrão**
```properties
server.port = 9000

# Registro de Usuários
# a propriedade hss.user é tratado como um Array
# app.user[n].name = {Nome do usuário}
# app.user[n].username = {Conta do login}
# app.user[n].password = {Senha de login}
app.users[0].name = FullStack 01
app.users[0].username = desafio
app.users[0].password = 123
app.users[1].name = FullStack 02
app.users[1].username = fullstack
app.users[1].password = 456
```

Arquivo disponível na pasta *src\main\resources*.


### Testes
Os teste unitários utilizam as bibliotecas do JUnit e do Spring Boot, sendo executadas pelo Gradle.

Execução os Teste:
```sh
$ // Execute o comando no terminal posicionado dentro da pasta task-manager-backend.
$ ./gradlew teste
```

O resultado dos teste automatizados executados são gravados nas sub-pastas da pasta *build/test-results*.

### Execução
A aplicação **task-manager-backend** utiliza o framework **Spring Boot** que possui servidor http embutido, sendo disponibilizado os serviços de endpoints na **porta 9000**.

> A porta do servidor http-server está configurado no arquivo **application.properties** da aplicação. Caso seja necessário alterar a porta do servido http do backend, é necessário ajustar a configuração *UrlBase* e *UrlBase* do arquivo **app.environment.js** da aplicação do frontend.

Execução:
```sh
$ // Execute o comando na pasta task-manager-backend do segundo terminal
$ ./gradlew run
```

## Front-end

Acesse o diretório do **Front-end** via terminal de linha de comando (outra instância de terminal).

```sh
$ cd /<diretório do repositório>/task-manager-fullstack/task-manager-frontend
$ npm install http-server -g
$ npm install jasmine
$ npm install jasmine -g
```

### Configurações
No módulo de *front-end* através do arquivo **app/app.environment.js** é possível configurar:
- UrlBase: Define a Url de acesso ao servidor de back-end no formato 'http://<hostname>:porta>' para autenticação;
- Auth: Endpoint principal do submódulo de autenticação;
- UrlBaseTask: Define a Url de acesso ao servidor de back-end no formato 'http://<hostname>:porta>' para acesso submódulo de TaskManager;
- API_Task: Endpoint principal do submódulo de TaskManager;

**Configuração padrão**
```js
window.app.constant("ENVIRONMENT", {
    'UrlBase': 'http://localhost:9000',
    'Auth': '/api/v1/auth',
    'UrlBaseTask': 'http://localhost:9000',
    'API_Task': '/api/v1/tasks'
});
```

### Testes
Os teste unitários do front-end utiliza a biblioteca Jasmine, framework para testes de código JavaScript.

Para execução manual, para o arquivo **spec/spec_runner.html** no browser Chrome.

### Execução
A aplicação **task-manager-frontend** contém todos as bibliotecas necessárias para ser executado, necessitando somente a execução de um servidor http que responda os arquivo da pasta e subpastas onde ele foi executado.

O site da aplicação está disponível em *task-manager-frontend/src*.

```sh
$ // Execute o comando na pasta task-manager-frontend do terminal do *front-end*
$ cd src
$ http-server
```

O servidor **http-server** instalado no npm é executado como padrão na **porta 8080**, caso deseje executar em outra porta, execute o comando:
```sh
$ http-server -p <porta>
```

# Acessando a aplicação
Acesse a aplicação em um browser e digite a url *http://localhost:8080* ou a url configurada na execução do servidor http-server do *front-end*.



# Considerações sobre o projeto

Inicialmente, este pequeno projeto foi idealizado para ter dois módulos de back-end, sendo um reponsável pela **autenticação** e outro responsável pela **gerenciamento das tarefas**, sendo executados como microserviços isolados o front-end utilizaria de token produzido pela biblioteca JWT pelo módulo de **autenticação** para validação das chamadas como os demais módulos. Porém devido ao tempo disponibilizado, esta primeira entrega dividiu somente os módulos de *front-end* e *back-end*.

## Teste
Nos teste de *front-end*, foi criado somente estes de autenticação, o objetivo foi demonstrar os recursos do Jasmine para simulação de chamada http para validação de integração. As demais coberturas de teste segue o mesmo padrão de teste unitário.

# Próximos passos
Embora este projeto foi realizado para um objetivo específico de avaliação, ele possui elementos para ser evoluído como aplicação conceito de estudo e exemplo para a comunidade de desenvolvimento.

## Tópicos à serem evoluídos

### Front-end
- Automatizar o processo de build com Grunt;
- Incluir JSHint para análise de código estático;
- ~~Aumentar a cobertura de testes~~;
- Configurar o framework Karma para execução de testes automatizados em javascript;
- Ajustar as páginas HTMLs para serem responsivas com dispositívos móveis.

### Back-end
- Realizar a separação dos submódulos *authentication* e *taskManager* para microserviços;
- Ajustar as configurações de cabeçalhos http;
- Implementação full do JWT e validação de token nas chamadas de endpoints;


Até+
