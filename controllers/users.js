const user = require('../models/userSchema');
const article = require('../models/');

const getCurrentUser = (req, res, next) => {
    user.findById(req.user._id)
        .then((user) => {
            if (user) {
                res.send(user._doc);
            } else {
                throw
            }
        })
        .catch((err) => {
            console.log('err!!', err)
            next(err)
        });
};

const createUser = (req, res, next) => {
    const { email, password, name } = req.body;
    if (!password || !email || !name) {
        
    }
}