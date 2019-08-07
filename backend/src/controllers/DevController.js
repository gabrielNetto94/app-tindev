const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
    
    async index(req, res){
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);

        const users = await Dev.find({ //exemplo de uma query 
            $and: [
                { _id: { $ne: user} },//seleciona os usuarios do banco menos o user, que é o usuário que está logado "ne" = not equal
                { _id: { $nin: loggedDev.likes } } , // "nin" = not in, seleciona usuários que não estejam no array  de likes, 
                { _id: { $nin: loggedDev.dislikes } } ,// "nin" = not in, seleciona usuários que não estejam no array  de dislikes, 
            ],
        })

        return res.json(users);
    },

    async store(req, res){//como existe um await no método, obrigatoriamente deve-se usar o async

        const { username } = req.body;//pega o username da requisiçao recebida

        const userExists = await Dev.findOne({user:username});//busca o usuário no mongo

        if(userExists){//se userExists = true retorna o usuário cadastrado no banco
            return res.json(userExists);
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);//pesquisa na api do github o usuário
        
        const {name, bio, avatar_url: avatar } = response.data;

        const dev = await Dev.create({
            name,
            user: username,
            bio,
            avatar
        });

        return res.json(dev);
    }
};