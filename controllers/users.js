var User = require('../models/user');
var jwt = require('jsonwebtoken');
var SECRET = process.env.SECRET;
var auth = require('../config/auth');

module.exports = {
  create,
  login,
  logout,
  me
};

function create(req, res, next) {
  User.create(req.body).then(user => {
    var token = jwt.sign({
      user: user
    }, SECRET, {expiresIn: '30m'});
    res.set('Authorization', token);
    res.json({msg: 'logged in successfully'});
  }).catch( err => res.status(400).json(err) );
}

function login(req, res, next) {
  User.findOne({email: req.body.email}).exec().then(user => {
    if (!user) return res.status(401).json({err: 'bad credentials'});
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch) {
        var token = jwt.sign({
          user: user
        }, SECRET, {expiresIn: '30m'});
        res.set('Authorization', token);
        res.json({msg: 'logged in successfully'});
      } else {
        return res.status(401).json({err: 'bad credentials'});
      }
    });
  }).catch(err => res.status(401).json(err));
}

function logout(req, res, next) {
  req.session.userId = null;
  res.status(200).json({});
}

// // Called by client to get logged in user doc
// // Won't be needed with JWT auth
function me(req, res, next) {
  res.json(req.user);
}




// module.exports = {
//   create,
//   login,
//   logout,
//   me
// };

// function create(req, res, next) {
//   User.create(req.body).then(user => {
//     auth.createToken(user, res);
//     res.json({msg: 'signed up successfully'});
//   }).catch( err => res.status(400).json(err) );
// }

// function login(req, res, next) {
//   User.findOne({email: req.body.email}).exec().then(user => {
//     if (!user) return res.status(401).json({err: 'bad credentials'});
//     user.comparePassword(req.body.password, (err, isMatch) => {
//       if (isMatch) {
//         auth.createToken(user, res);
//         res.json({msg: 'logged in successfully'});
//       } else {
//         return res.status(401).json({err: 'bad credentials'});
//       }
//     });
//   }).catch(err => res.status(401).json(err));
// }

// function logout(req, res, next) {
//   req.session.userId = null;
//   res.status(200).json({});
// }

// // Called by client to get logged in user doc
// // Won't be needed with JWT auth
// function me(req, res, next) {
//   res.json(req.user);
// }
