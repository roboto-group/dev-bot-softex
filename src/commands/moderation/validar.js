const { ApplicationCommandOptionType, Client, Interaction } = require("discord.js");
const User = require('../../models/Users');

function padronizaCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  return cpf
}

function validarCPF(cpf) {
  // Remover espaços em branco e caracteres especiais
  cpf = cpf.replace(/[^a-zA-Z0-9]/g, '');
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
    try {
      //verifica se o usuario e bot
      if (interaction.user.bot) return;
      
      //verifica se a interacao foi feita de dentro de um servidor
      if (!interaction.inGuild()) return;

      await interaction.deferReply({ephemeral: true});

      let cpf = interaction.options._hoistedOptions[0].value

      //verifica se o CPF informado e valido
      if (validarCPF(cpf) == false){
        interaction.editReply(`O CPF informado, não é válido!\nTente novamente ou entre em contato com os administradores do servidor.`)
        return
      }

      cpf = padronizaCPF(cpf)

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
        if (user.userId) {
          interaction.editReply(`Você ja foi validado anteriormente`)
          return

        } else {
          //comentei para facilitar os testes >> retirar quando acabar os testes ******
          //user.userId = interaction.user.id
          console.log('userId foi adicionado ao BD')
          //Pega as roles que o usuario possui no servidor
          const getUserRoles = interaction.member.roles.cache.map(role => ({ [role.id]: role.name }))
          //Testa se a role ja existe no BD. Se não existir ela é adicionada
          for (let role of getUserRoles){
            let roleName = Object.values(role)
            let roleID = Object.keys(role)
            console.log(role)
              try {
                //ignora o cargo @everyone
                if (roleID == '1180816511636619305') {
                  continue
                  };
                //removendo cargo residente old
                if (roleID == '1221917320339787776') {
                  interaction.member.roles.remove('1221917320339787776')
                  continue
                  };
                const documento = await User.findOne({ ['cpf']: cpf, [`cargos.${roleID}`]: { $exists: true } }); 
                
                if (!documento) {
                  console.log(`O cargo ${roleName} com ID ${roleID}, foi adicionado ao BD.`);
                  user.cargos.push(role)
                };
              } catch (error) {
                  console.error('Erro ao consultar o banco de dados:', error);
              };  
          };
        };
        if (!user.guildId) {
            user.guildId = interaction.guild.id;
            console.log('guildId atualizado!');
        };
        //insere no banco um timestanp de quando o usuário foi validado
        user.dataValidacao = new Date();
        await user.save();
        console.log('Atualizações salvas no Banco de Dados.');

        //resposta ao usuário
        await interaction.editReply({
          content: 'Você foi validado com sucesso!',
        });
        
        //Verifica se os cargos que usuário possui no BD e atribui eles no Discord, caso já não foram atribuidos.
        const novoUser = interaction.member
        const novoUserID = interaction.user.tag

        try {
          console.log(user.cargos)
          for (let role of user.cargos){
            const roleID = Object.keys(role)[0]
            const roleName = Object.values(role)[0]
            if (!interaction.member.roles.cache.has(roleID)) {
              novoUser.roles.add(roleID);
              console.log(`${novoUserID} recebeu o cargo: ${roleName}`);
            };
          };
        } catch (error) {
          console.log('Erro ao consultar BD para atribuir cargos', error)
        };
        
      //caso o usuário não exista no BD  
      } else {
        interaction.editReply(`O CPF informado, não foi localizado no nosso sistema!\nTente novamente ou entre em contato com algum administrador.`)
        return;
      };
    } catch (error) {
      console.log(error)
    };
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
};