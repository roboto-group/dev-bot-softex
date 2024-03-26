const { ApplicationCommandOptionType, Client, Interaction } = require("discord.js");
const User = require('../../models/Users');

module.exports = {
  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction, ) => {

    const idCargo = '1221664065601146890'
   
    try {
      //verifica se o usuario e um robo
      if (interaction.user.bot) return;
      
      //verifica se a interacao foi feita de dentro de um servidor
      //??? Pq o if esta comentado?
      //if (!interaction.inGuild()) return;

      const cpf = interaction.options._hoistedOptions[0].value
      
      await interaction.deferReply({ephemeral: true});

      //criando a consulta
      let query = {
        cpf: cpf
      };

      //fazendo a consulta ao BD
      let user = await User.findOne(query);
    
        //lista as roles do usuario apos usar /validar
        //usar role.id para pegar o id do cargo
        //usar (role => `${role.id}: ${role.name}`).join(", ") para pegar id e nome do cargo
        const getUserRoles = interaction.member.roles.cache.map(role => role.name).join(", ")
        console.log(`Cargos de ${interaction.member.displayName}: ${getUserRoles}`);
        //lista todos as roles que existem no servidor
        const getGuildRoles = interaction.guild.roles.cache.map(role => role.name).join(", ")
        console.log(`Cargos do servidor: ${getGuildRoles}`);
        //Informa quantas roles existem no servidor. @everyone conta como role
        interaction.guild.roles.fetch()
          .then(roles => console.log(`Total de cargos no servidor: ${roles.size}`))
          .catch(console.error);


      //Se o usuario existir no BD
      if (user) {
        console.log('CPF localizado no banco de dados!')
        

        // Verificando se o userId e o guildId estão vazios no BD e atualizando-os.
        
        if (!user.userId) {
          console.log('userId do Discord foi vinculado ao CPF')
          user.userId = interaction.user.id
          if (!user.guildId) {
            console.log('guildId atualizado!');
            user.guildId = interaction.guild.id;
          }
          console.log('Atualizações salvas no Banco de Dados.');
          await user.save();
        }; 
        
        //resposta ao usuário
        await interaction.editReply({
          //??? Modificar mensagem de acordo com o canal/cargo
          content: `${user.userName} é um aluno do curso de ${user.curso} do turno da ${user.horario}.`,
          ephemeral: true,
        });
        
        const novoUser = interaction.member
        
        if (user.curso === 'residente') {
          
          //passando o cargo
          novoUser.roles.add(idCargo);
        };
      
      } else { // caso o usuário não exista no BD
        
        interaction.editReply(`CPF não foi localizado!\n Tente novamente ou entre em contato com algum administrador.`)
        return;
      }

    } catch (error) {
      console.log(error)
    }
  },
  
  name: 'validar',
  description: 'Faz a validação do usuário',
  options: [
    {
      name: 'cpf',
      description: 'Digite seu CPF:',
      required: true,
      type: ApplicationCommandOptionType.String,
    }
  ]
}

