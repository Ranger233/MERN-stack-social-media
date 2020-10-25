// fetching, adding, updating profiles
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const auth = require('../../middleware/auth') //middleware

// database collections(tables)
const Profile = require('../../models/Profile')
const User = require('../../models/Users')

// @route request type:GET, endpoint:api/profile/me
// @description: send user's profile to client-side
// @access: private
router.get('/me', auth, async (req, res) => {
  try {
    // find user's profile in "Profile" DB collection according to his ID, and use "populate" to add "name" and "avatar" field in "user" DB collection
    const profile = await Profile.findOne({ user: req.user.id}).populate(
      'user',
      ['name','avatar']
    )

    if(!profile){
      res.status(400).json({ msg:'There is no profile for this user' })
    }

    res.json(profile)

  } catch (err) {
    console.error(err.message)
    res.statusCode(500).json({ msg:'server error' })
  }
})


// @route request type:POST, endpoint:api/profile
// @description: add or update user's profile'
// @access: private
router.post(
  '/',
  [ // There are 2 middlewares here, so we put them in []
    auth, //the 1st middleware
    [  // the 2nd middleware
      check('status','status is required').not().isEmpty(),
      check('skills','skills is required').not().isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() }) // 400:bad request
    }

    const {  //destructure req.body object
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body

    // build profile object
    const profileFields = {}
    if(company) profileFields.company = company
    if(website) profileFields.website = website
    if(location) profileFields.location = location
    if(bio) profileFields.bio = bio
    if(status) profileFields.status = status
    if(githubusername) profileFields.githubusername = githubusername
    if(skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim())
    }

    //build social object
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube
    if(twitter) profileFields.social.twitter = twitter
    if(facebook) profileFields.social.facebook = facebook
    if(linkedin) profileFields.social.linkedin = linkedin
    if(instagram) profileFields.social.instagram = instagram

    try {
      // find profile according to user.id in request
      let profile = await Profile.findOne({ user: req.user.id })

      // if there is a profile, update it
      if(profile){
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }//if true, return the modified document rather than the original.
        )
        return res.json(profile)
      }
      

      // if there is no profile, create one
      profile = new Profile(profileFields)
      await profile.save()
      return res.json(profile)

    } catch (err) {
      console.error(err.message)
      res.status(500).json({ msg:'server error' })
    }




  }
)

module.exports = router