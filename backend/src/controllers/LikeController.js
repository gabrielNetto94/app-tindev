const Dev = require('../models/Dev');

module.exports = {
    async store(req, res){
        
        const { user } = req.headers;
        const { devId } = req.params;
        
        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if(!targetDev){
            return res.status(400).json({error: 'Dev not exists'});//retorna o status = erro
        }

        if(targetDev.likes.includes(loggedDev._id)){//quando os dois tiverem dado like um no outro: match
            console.log("MATCH!!");
        }

        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();

        return res.json(loggedDev);
    }
};