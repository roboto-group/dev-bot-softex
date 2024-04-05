const { ApplicationCommandOptionType, Client, Interaction } = require("discord.js");
const Users = require('../../models/Users');

module.exports = {
  callback: async (client, interaction) => {
    
    //Armazenando todos os usuários do BD em users
    let users = await Users.find({});
    let contador = 0
    let temCargoEspecifico = false
    let cargoEspecifico = '1221917320339787776'
    
    for (let user of users) {
      if (user.cargos.length > 0) {
        user.cargos = [] 
        //interaction.member.roles.remove(cargoEspecifico);
        console.log(`${user.nome} teve os cargos deletados.`)
      }
      
      //Salvando as alterações no BD
      await user.save();
      contador++
    }
    
    console.log(`Iterei por ${contador} registros.`)
  },
    
  name: 'loop_del',
  description: 'Faz o loop nos usuários armazenados no banco deletanto todos os cargos ',
  devOnly: true,

}