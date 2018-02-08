const jwt = require("jwt-simple");
const User = require("../models/user");
const config = require("../config");

tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
};

exports.signin = (req, res, next) => {
    res.send({token : tokenForUser(req.user)})
};

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "you need to provide email and pass" });
  }

  // check duplicate record
  User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    // if user  exists
    if (existingUser) {
      return res.status(422).send({ error: " Email in use" });
    }

    const user = new User({
      email: email,
      password: password
    });

    user.save(err => {
      if (err) {
        return next(err);
      }
      res.json({ token: tokenForUser(user) });
    });
  });

  //
};
