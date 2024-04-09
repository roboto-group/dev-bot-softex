const { ModalSubmitInteraction, Client, Interaction, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const User = require('../../models/Users');
/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 * @returns 
 */

//variável global que armazenará o cpf digitado pelo membro recém-chegado
let cpfValue;
//variável global que armazenará o objeto da interação de sumbissão de modal
let interactionModal;

module.exports = async (client, interaction) => {

    if(!interaction.isButton()) return;

    //criando o modal
    const modal = new ModalBuilder()
    .setCustomId('verifyModal')
    .setTitle('Verificação de CPF');

    //criando o componente de input do CPF
    const cpfInput = new TextInputBuilder()
    .setCustomId('cpfInput')
    .setLabel('Digite o seu CPF abaixo:')
    .setStyle(TextInputStyle.Short)
    .setMaxLength(15)
    .setPlaceholder('Digite apenas números.')
    .setRequired(true);

    //precisa de um ActionRow pra cada input de texto
    const actionRow = new ActionRowBuilder().addComponents(cpfInput);

    //adicionando o input ao modal
    modal.addComponents(actionRow);

    //mostrando o modal ao usuário
    await interaction.showModal(modal);

    //esperando o modal ser submetido
    const filter = (interaction) => interaction.customId === 'verifyModal';

    const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 30_000 });

    if (modalInteraction) {
        cpfValue = modalInteraction.fields.getTextInputValue('cpfInput');
        interactionModal = modalInteraction;

        //await modalInteraction.editReply(`A submissão do Modal foi bem sucedida!`);
    }

    //console.log(cpfValue);
    //console.log(interactionModal);
    //console.log(interaction);

    /**
     * SEÇÃO ABAIXO DEVE TER O SCRIPT PARA VERIFICAÇÃO DO CPF
     */

     
    //IDs dos cargos
    const idCargoFront = '1186625105565061120'
    const idCargoBack = '1186625588874706955'
    
    try {
      //verifica se o usuario pe um robo
      if (interactionModal.user.bot) return;

      //verifica se a interacao foi feita de dentro de um servidor
      //if (!interaction.inGuild()) return;

      //Será necessário construir uma validação para o CPF -> @Marlos, se garante??
      //const cpf = interaction.options._hoistedOptions[0].value
      
      await interactionModal.deferReply({ephemeral: true});

      //criando a consulta
      let query = {
        cpf: cpfValue,
      };

      //fazendo a consulta ao BD
      let user = await User.findOne(query);

      //Se o usuario existir no BD
      if (user) {
        console.log('Achei seu CPF no banco de dados!')
        
        // Verificando se o userId e o guildId estão vazios no BD e atualizando-os.
        
        if (!user.userId) {
          console.log('userId do Discord foi vinculado ao CPF')
          user.userId = interaction.user.id
          if (!user.guildId) {
            console.log('guildId atualizado!');
            user.guildId = interaction.guild.id;
          }
          console.log('Atualizações salves do Banco de Dados.');
          await user.save();
        }; 
          
        //resposta ao usuário
        await interactionModal.editReply({
          content: `${user.nome} é um aluno do curso de ${user.curso} do turno da ${user.turno}.`,
          ephemeral: true,
        });
          
        
        const novoUser = interactionModal.member
        
        //Dando um tempo para que o usuario veja a respota do BOT
        setTimeout(()=>{
          
          //removendo cargo de Não-verificado
          novoUser.roles.remove('1194646146325426176');
          
        }, 3000)
        
        if (user.curso === 'frontend') {
          
          //passando o cargo
          novoUser.roles.add(idCargoFront);
        } else if (user.curso === 'backend') {
          //passando o cargo
          novoUser.roles.add(idCargoBack);
        };
            
        
      } else { // caso o usuário não exista no BD
        //criação da embed de boas-vindas
      const cadastroEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Cadastramento:')
      .setDescription(`${user.name}, vimos que você não participa dos cursos ministrados pela SOFTEX. Por isso, para que tenha acesso ao servidor, realize o cadastro clicando no botão abaixo.`)
      .addFields(
          { name: 'Dúvidas?', value: 'Fale com a coordenação do curso.' },
          { name: '\u200B', value: '\u200B' },
      )
      .setTimestamp()
      .setFooter({ text: 'SOFTEX Pernambuco', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        
        //await interactionModal.editReply(`Não consegui encontrar seu CPF no banco de dados! 😒 Entre em contato com o Adm do curso.`)
        //return;
      }


    } catch (error) {
      console.log(error);
    }


}


