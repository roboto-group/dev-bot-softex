const { ApplicationCommandOptionType, Client, Interaction } = require("discord.js");
const User = require('../../models/Users');

function validarCPF(cpf) {
  // Remover espaços em branco e caracteres especiais
  cpf = cpf.replace(/\D/g, '');
  // Verificar se o CPF tem 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }
  // Verificar se todos os dígitos são iguais
  let isAllDigitsEqual = cpf.split('').every((char, index, array) => char === array[0]);
  if (isAllDigitsEqual) {
    return false;
  }

  // Verificar dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;

  soma = 0;
  for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;

  // Comparar dígitos verificadores calculados com os dígitos verificadores informados
  if (parseInt(cpf.charAt(9)) !== digito1 || parseInt(cpf.charAt(10)) !== digito2) {
      return false;
  }

  // Se todas as validações passaram, o CPF é válido
  return true;
}

module.exports = {
  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction, ) => {
    //cargo backend
    const idCargo = '1221918638898942162'
   
    try {
      //verifica se o usuario e bot
      if (interaction.user.bot) return;
      
      //verifica se a interacao foi feita de dentro de um servidor
      //if (!interaction.inGuild()) return;

      await interaction.deferReply({ephemeral: true});

      const cpf = interaction.options._hoistedOptions[0].value
      //verifica se o CPF informado e valido
      if (validarCPF(cpf) == false){
        //await interaction.reply({ content: 'Secret Pong!', ephemeral: true });
        interaction.editReply(`O CPF informado não é válido!\nTente novamente ou entre em contato com os administradores do servidor.`)
        return
      }

      //criando a consulta
      let query = {
        cpf: cpf
      };

      //fazendo a consulta ao BD
      let user = await User.findOne(query);
      //Se o usuario existir no BD
      if (user) {
        console.log('CPF localizado no banco de dados!')
        

        // Verificando se o userId e o guildId estão vazios no BD e os atualiza.
        if (!user.userId) {
          user.userId = interaction.user.id
          console.log('userId do Discord foi vinculado ao CPF')
        };
        if (!user.guildId) {
            user.guildId = interaction.guild.id;
            console.log('guildId atualizado!');
        };
        //lista as roles do usuario apos usar /validar
        user.cargos = interaction.member.roles.cache.map(role => ({ [role.id]: role.name }))
        const getUserRolesID = interaction.member.roles.cache.map(role => role.id)
        
        console.log('Atualizações salvas no Banco de Dados.');
        await user.save();


        //resposta ao usuário
        await interaction.editReply({
          //??? Modificar mensagem de acordo com o canal/cargo
          content: `${user.nome} é um aluno do curso de ${user.curso} do turno da ${user.turno}.`,
          ephemeral: true,
        });
        
        const novoUser = interaction.member
        
        if (user.curso === 'Back-end') {
          //passando o cargo
          novoUser.roles.add(idCargo);
        };
      
      } else { // caso o usuário não exista no BD
        interaction.editReply(`CPF não foi localizado!\nTente novamente ou entre em contato com algum administrador.`)
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

