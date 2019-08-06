const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
    async store(req, res){//como existe um await no método, obrigatoriamente deve-se usar o async

        const { username } = req.body;//pega o username da requisiçao recebida

        const userExists = await Dev.findOne({user:username});

        if(userExists){
            return res.json(userExists);
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);//pesquisa na api do github o usuário
        
        const {name, bio, avatar_url: avatar } = response.data;

        const dev = await Dev.create({
            name,
            user: username,
            bio,
            avatar
        })

        return res.json(dev);
    }
};