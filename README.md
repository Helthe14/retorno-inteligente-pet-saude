# 🩺 Retorno Inteligente - PET SAÚDE DIGITAL (UFRR)

> Sistema moderno, responsivo e inteligente desenvolvido para simplificar agendamentos, facilitar retornos de consultas e diminuir o índice de faltas de pacientes através da automação de lembretes, integração direta com calendários digitais (Google Calendar, iCal) e compartilhamento prático via WhatsApp ou QR Code.

---

## 📋 Sobre o Projeto

O **Retorno Inteligente** é uma ferramenta projetada e desenvolvida no âmbito do **PET SAÚDE DIGITAL** da **UFRR (Universidade Federal de Roraima)**. O principal objetivo é promover o cuidado contínuo e a saúde preventiva por meio de uma interface intuitiva, integrando tecnologia de ponta para conectar profissionais de saúde e pacientes da melhor forma.

O sistema opera de forma **100% client-side (executado diretamente no navegador)**, o que traz excelentes vantagens:
1. **Privacidade e Segurança Total**: Nenhum dado pessoal ou clínico dos pacientes é enviado ou armazenado em servidores externos. Todos os agendamentos cadastrados ficam guardados de forma segura no banco de dados local do próprio navegador do profissional (`localStorage`).
2. **Custo Zero de Servidores (Serverless)**: Os links de consulta gerados para os pacientes contêm todas as informações do agendamento compactadas e codificadas diretamente no endereço URL (`?p=...`). Ao clicar no link ou ler o QR Code, o dispositivo do paciente decodifica as informações instantaneamente sem precisar consultar nenhum banco de dados externo.

---

## 🛠️ Funcionalidades Principais

- **Painel de Controle do Profissional (Clinician Hub)**: Cadastro fácil de novos retornos, acompanhamento em tempo real e monitoramento de listas ativas e arquivadas.
- **Configurações Personalizáveis**: Edição rápida do nome da unidade ou clínica, nome do profissional de saúde responsável, local de atendimento padrão e observações padrão para agilizar o fluxo de agendamentos.
- **Gerador de QR Code Instantâneo**: Criação automatizada de QR Code individual para cada consulta, ideal para ser impresso em cartões físicos de retorno ou exibido na tela para que o paciente escaneie com seu celular.
- **Integração com WhatsApp**: Compartilhamento facilitado com o envio automático de mensagens pré-formatadas contendo todos os detalhes da consulta e o link de acesso exclusivo do paciente.
- **Landing Page do Paciente**: Uma página web exclusiva, elegante e adaptada para dispositivos móveis, contendo:
  - **Adicionar à Agenda do Google**: Integração com o Google Calendar com apenas 1 clique.
  - **Download de Arquivo iCalendar (.ics)**: Compatível com o Calendário do iPhone (iOS), Outlook e outros aplicativos.
  - **Link de Localização**: Botão que abre a rota de trajeto diretamente no Google Maps.
  - **Botão de Confirmação**: Link direto para entrar em contato com o profissional ou confirmar presença por WhatsApp.
- **Histórico Completo**: Acompanhamento visual dos retornos concluídos, cancelados ou pendentes.
- **Design Adaptativo com Dark Mode**: Interface fluida, moderna, limpa e com suporte a tema escuro automático ou manual, reduzindo a fadiga visual.

---

## 🚀 Como Funciona o Sistema (Tutorial Passo a Passo)

### Passo 1: Configurar a Clínica/Profissional
Antes de cadastrar seus pacientes, defina as informações padrão para que você não precise redigitá-las todas as vezes:
1. No canto superior direito do painel de administração, clique no botão **Configurações** (ícone de engrenagem).
2. Insira as informações da sua rotina de atendimento:
   - **Nome da Clínica/Unidade de Saúde** (ex: *PET SAÚDE DIGITAL - UFRR*)
   - **Nome do Profissional** (ex: *Dr. Silva*)
   - **Local de Atendimento** (ex: *Bloco de Medicina, Sala 12 - Campus Paricarana*)
   - **Instruções Padrão** (ex: *Chegar com 15 minutos de antecedência e trazer exames anteriores.*)
3. Clique em **Salvar Configurações**. O navegador guardará estes dados automaticamente para as próximas consultas.

### Passo 2: Cadastrar uma Consulta de Retorno
1. Na seção **Novo Retorno**, preencha os dados do paciente:
   - **Nome do Paciente**
   - **Título/Especialidade** (ex: *Consulta de Pediatria*, *Reavaliação Geral*)
   - **Data e Horário** previstos.
   - **Local e Observações** (já virão sugeridos das suas configurações, mas você pode editá-los para um paciente específico).
2. Clique em **Criar Retorno**.

### Passo 3: Enviar as Informações ao Paciente
Após a criação, o agendamento aparecerá no topo da lista. Você tem 3 opções eficientes para compartilhá-lo:
* **Enviar por WhatsApp**: Abre o WhatsApp Web ou aplicativo de celular com uma mensagem profissional pronta (contendo o nome do paciente, data, hora, local e o link exclusivo).
* **Mostrar QR Code**: Exibe o QR Code exclusivo daquela consulta na tela. Você pode pedir para o paciente apontar a câmera do celular ou clicar em **Imprimir Cartão** para dar um lembrete físico de papel ao paciente.
* **Copiar Link**: Copia o endereço direto da página do paciente para que você possa colar no e-mail, SMS ou em outro canal de preferência.

### Passo 4: Experiência do Paciente ao Acessar
Quando o paciente escaneia o QR Code ou clica no link compartilhado, ele abre a landing page limpa e dedicada à consulta dele, onde poderá:
1. Confirmar com precisão o dia, horário, nome do profissional e local do retorno.
2. Tocar em **"Adicionar à Minha Agenda do Google"** ou **"Baixar para Calendário Apple"** para que o celular crie um lembrete e notifique-o no dia do compromisso.
3. Tocar no botão de **Localização** para traçar a rota até a clínica diretamente no Google Maps.
4. Entrar em contato via WhatsApp para confirmar a presença ou reagendar em caso de imprevistos.

### Passo 5: Gerenciar e Acompanhar os Retornos
No painel do profissional, você pode gerenciar toda a fila de pacientes:
- Marque como **"Confirmados"** ou gerencie status para monitorar quem já visualizou e confirmou a presença.
- Monitore no **Histórico** o total de retornos agendados, confirmados ou cancelados para extrair dados de assiduidade e impacto do PET SAÚDE DIGITAL.

---

## 💻 Como Executar o Projeto Localmente (Desenvolvimento)

Se você deseja executar o projeto em sua máquina local para testes ou desenvolvimento:

### Pré-requisitos
- **Node.js** (versão 18 ou superior) instalado no sistema.
- **NPM** (instalado automaticamente com o Node) ou **Yarn**.

### 1. Clonar o projeto
Extraia o projeto ZIP baixado ou clone-o usando o Git:
```bash
git clone <URL_DO_SEU_REPOSITORIO_GITHUB>
cd retorno-inteligente
```

### 2. Instalar as dependências do projeto
```bash
npm install
```

### 3. Executar o servidor de desenvolvimento local
```bash
npm run dev
```
O aplicativo iniciará o servidor Vite local. Abra o endereço `http://localhost:3000` ou `http://localhost:5173` no navegador de sua preferência para interagir com o sistema.

### 4. Gerar a build otimizada de produção
```bash
npm run build
```
Os arquivos estáticos compilados e minificados serão salvos na pasta `/dist`, prontos para serem hospedados gratuitamente na web.

---

## 🐙 Como Colocar este Projeto no seu GitHub (Passo a Passo)

Siga os passos detalhados abaixo para enviar o projeto ao seu perfil do GitHub e compartilhá-lo com sua equipe:

### Método 1: Exportando pelo AI Studio (Interface Visual)
1. No canto superior direito da tela do Google AI Studio, clique no ícone de engrenagem / menu de configurações da aplicação.
2. Selecione a opção **Export as ZIP** para baixar o projeto completo compilado e pronto para o seu computador.
3. Extraia o arquivo ZIP em uma pasta de sua escolha no seu computador.
4. Acesse o seu perfil no [GitHub](https://github.com) e clique no botão **New** (Novo Repositório).
5. Defina um nome para o repositório (ex: `retorno-inteligente-pet-saude`) e marque como **Público** ou **Privado** de acordo com sua preferência. **Não marque** as caixas de inicialização (README, .gitignore ou License) para mantê-lo vazio. Clique em **Create repository**.
6. No seu computador, abra o terminal na pasta onde você extraiu o ZIP e execute os comandos de terminal listados no **Método 2**.

### Método 2: Enviando via Linha de Comando (Git CLI)
Com o Git instalado e configurado em seu computador, abra a pasta do projeto no terminal e execute os seguintes comandos em ordem:

1. **Inicialize o repositório Git local**:
   ```bash
   git init
   ```

2. **Adicione todos os arquivos do projeto para monitoramento**:
   ```bash
   git add .
   ```

3. **Crie o primeiro commit com as alterações**:
   ```bash
   git commit -m "feat: inicializando projeto Retorno Inteligente - PET Saúde Digital"
   ```

4. **Defina a branch principal como main**:
   ```bash
   git branch -M main
   ```

5. **Associe ao seu repositório remoto criado no GitHub**:
   *(Substitua `<seu-usuario>` e `<nome-do-repositorio>` com os seus dados reais do link gerado pelo GitHub)*
   ```bash
   git remote add origin https://github.com/<seu-usuario>/<nome-do-repositorio>.git
   ```

6. **Envie o código para o GitHub**:
   ```bash
   git push -u origin main
   ```

---

## 🚀 Como Hospedar o Projeto Grátis na Web

Como este sistema é 100% estático (Single Page Application - SPA), você pode hospedá-lo de forma **totalmente gratuita** e sem configurações complexas nos seguintes serviços:

### Opção 1: Vercel ou Netlify (Recomendado pela simplicidade)
1. Crie uma conta gratuita em [vercel.com](https://vercel.com) ou [netlify.com](https://netlify.com) conectando o seu perfil do GitHub.
2. Clique em **Add New** (Adicionar Novo) > **Project** (Projeto).
3. Selecione o repositório do seu GitHub onde você acabou de enviar o projeto.
4. O sistema detectará automaticamente que o projeto é baseado em Vite. Não mude nenhuma configuração.
5. Clique em **Deploy**. Em menos de 1 minuto, o seu sistema estará publicado com um link profissional (ex: `retorno-inteligente.vercel.app`) para que todos usem em tempo real!

### Opção 2: GitHub Pages
Você também pode hospedar diretamente pelas configurações do GitHub:
1. Vá até a aba **Settings** (Configurações) no seu repositório do GitHub.
2. No menu lateral esquerdo, selecione **Pages**.
3. Na seção **Build and deployment**, selecione **GitHub Actions** em vez de Deploy from branch.
4. Escolha ou configure o fluxo para um projeto em **Static HTML** ou **Vite/Node.js**, ou simplesmente use o fluxo de CI/CD para automatizar o deploy a cada atualização da branch `main`.

---

## 🎓 Créditos e Licença

Desenvolvido com foco no cuidado humanizado, contínuo e saúde preventiva vinculada ao **PET SAÚDE DIGITAL** da **Universidade Federal de Roraima (UFRR)**.

- **Tecnologias principais**: React 18, TypeScript, Tailwind CSS, Lucide-React, Vite.
- **Licença**: MIT. Sinta-se livre para utilizar, expandir, estudar e customizar o sistema de acordo com as necessidades da sua instituição de saúde ou de ensino.

---
