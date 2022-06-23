'use strict';

module.exports = (capability) => {

  return (req, res, next) => {

    try {
      if (req.user.capabilities.includes(capability)) {
        next();
      }
      else {
        res.status(403).send('Access Denied');
      }
    } catch (e) {
      next('Invalid Login');
    }

  };

};
