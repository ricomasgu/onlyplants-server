const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res, _) => {
  const userInput = { 
    firstName, 
    lastName, 
    email,
    username, 
    password,
    avatar
  } = req.body;

  if (password.length < 8) {
    return res.status(400).json({ 
      message: 'Your password must be 8 chars minimum' 
    });
  }

  const userInputValues = [...Object.values( userInput )];
  if( userInputValues.some( ( parameter ) => !parameter.localeCompare('') ) ) {
    return res.status(400).json({ 
      message: 'Your left some parameter empty' 
    });
  }

  try {
    // check if name exists in database -> show message
    const resFromDbFindUser = await User.findOne({ email })
    if ( resFromDbFindUser !== null ) {
      return res.status(400).json({
        message: 'The email has already an associated account'
      })
    }

    // hash the password, create the user and redirect to profile page
    const salt = bcrypt.genSaltSync();
    const passwordHashed = bcrypt.hashSync( password, salt );

    const resFromDbCreateUser = await User.create({
      firstName,
      lastName,
      email,
      username,
      password: passwordHashed,
      avatar
    })

    return res.status(200).json(resFromDbCreateUser);
    
    // login with passport:
    /* req.login( resFromDbCreateUser, error => {
      if ( error ) {
        return res.status(500).json({
          message: 'Error while attempting to login' 
        })
      }
      return res.status(200).json( resFromDbCreateUser )
    }) */
  }
  catch(error) {
    res.json( error )
  }
})

module.exports = router;