const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const fileUploader = require('../config/cloudinary.config');

const User = require('../models/User.model');

router.post('/signup', fileUploader.single('avatar'), async (req, res, _) => {
  const userInput = { 
    firstName, 
    lastName, 
    email,
    username, 
    password
  } = req.body;

  const avatar = req.file.path;

  if (password.length < 8) {
    return res.status(400).json({ 
      message: 'Your password must be 8 chars minimum' 
    });
  }

  /* const userInputValues = [...Object.values( userInput )];
  if( userInputValues.some( ( parameter ) => !parameter.localeCompare('') ) ) {
    return res.status(400).json({ 
      message: 'Your left some parameter empty' 
    });
  } */

  if (!req.file) {
    console.log('No file uploaded!');
    return;
  }

  try {
    // check if name exists in database -> show message
    const resFromDbFindUser = await User.findOne({ email })
    if ( resFromDbFindUser !== null ) {
      return res.status(400).json({
        message: 'The email has already an associated account'
      });
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
    });
    
    // login with passport:
    req.login( resFromDbCreateUser, error => {
      if ( error ) {
        return res.status(500).json({
          message: 'Error while attempting to login' 
        })
      }
      return res.status(200).json( resFromDbCreateUser )
    })
  }
  catch(error) {
    res.json( error );
  }
});

router.post('/login', (req, res, _) => {
  passport.authenticate('local', (error, userCredentials) => {
    if (error) {
        return res.status(500).json({
          message: 'Error while authenticating',
          error: error
        });
    }
    if (!userCredentials) {
        return res.status(400).json({ 
          message: 'Wrong credentials' 
        });
    }
    req.login(userCredentials, err => {
        if (err) {
            return res.status(500).json({ 
              message: 'Error while attempting to login' 
            });
        }
        return res.status(200).json(userCredentials);
    });
  })(req, res);
});

router.get('/loggedIn', (req, res) => {
  res.json(req.user);
})

router.post('/logout', (req, res) => {
  // logout the user using passport
  req.logout();
  res.json({ message: 'Successful logout' });
})

module.exports = router;