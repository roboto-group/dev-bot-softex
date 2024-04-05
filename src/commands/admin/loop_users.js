const { ApplicationCommandOptionType, Client, Interaction } = require("discord.js");
const Users = require('../../models/Users');

module.exports = {
  callback: async (client, interaction) => {
    
    //Armazenando todos os usuários do BD em users
    let users = await Users.find({});
    let contador = 0
    let temCargoEspecifico = false
    let cargoEspecifico = '1221917705754640544'
    let nomeCargoEspecifico = 'residente new'
    
    for (let user of users) {
      if (user.cargos.length > 0) {
        //1º passando pelos usuários que já tem cargos no BD
        
        //iterando pelos cargos do usuario 
        for (let cargoID of user.cargos) {
          const cargoIdUser = Object.keys(cargoID)[0]
          
          if (cargoIdUser === cargoEspecifico) {
            temCargoEspecifico = true
            
            console.log(`${user.nome} já tem o cargo específico`)
            return
          };    
        }

        //Se o cara nao tiver o cargo específico...
        //dentre os cargos que ele tem, ele o recebe
      
        if (!temCargoEspecifico) {
          console.log(`${user.nome} recebeu o cargo específico.`)
          
          //diponibilização de cargo específico no banco de dados e servidor
          user.cargos.push({ [cargoEspecifico]: nomeCargoEspecifico })
          //interaction.member.roles.add(cargoEspecifico)
        };
      } else {

        //O usuário não tem nenhum cargo no BD, então ganha o cargo no BD e no servidor discord
        user.cargos.push({ [cargoEspecifico]: nomeCargoEspecifico })
        //interaction.member.roles.add(cargoEspecifico)
        console.log(`${user.nome} recebeu o cargo específico.`)
      }
      
      //Salvando as alterações no BD
      await user.save();
      contador++
    }
    
    console.log(`Iterei por ${contador} registros.`)
  },
    
  name: 'loop_users',
  description: 'Faz o loop nos usuários armazenados no banco dando cargo ',
  devOnly: true,
}