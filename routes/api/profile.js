// fetching, adding, updating profiles
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const auth = require('../../middleware/auth') //import middleware

// import database collections(tables)
const Profile = require('../../models/Profile')
const User = require('../../models/Users')
const Post = require('../../models/Posts')

// @route    GET api/profile/me
// @desc     send current user's profile to client-side
// @access   private
router.get('/me', auth, async (req, res) => {
  try {
    // find user's profile in "Profile" DB collection according to his ID, and use "populate" to add "name" and "avatar" field in "user" DB collection
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'User',
      ['name','avatar']
    )

    if(!profile){
      res.status(400).json({ msg:'There is no profile for this user' })
    }

    res.json(profile)

  } catch (err) {
    console.error(err.message)
    res.status(500).send('server error')
  }
})


// @route    POST api/profile
// @desc     create or update user's profile'
// @access   private
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
    profileFields.user = req.user.id

    if(company) profileFields.company = company
    if(website) profileFields.website = website
    if(location) profileFields.location = location
    if(bio) profileFields.bio = bio
    if(status) profileFields.status = status
    if(githubusername) profileFields.githubusername = githubusername
    if(skills) {
      profileFields.skills = Array.isArray(skills)
      ? skills
      : skills.split(',').map((skill) => ' ' + skill.trim())
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
        //console.log('found profile');
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },// update this profile to "profileFields"
          { new: true }//if true, return the modified document rather than the original.
        )
        return res.json(profile)
      }
      //console.log('found no profile');
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


// @route    GET api/profile
// @desc     get all profiles
// @access   public
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg:'server error' })
  }
})


// @route    GET api/profile/user/:user_id
// @desc     get profile by userID
// @access   public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne(
      { user: req.params.user_id } // use "req.params.user_id" to access params in URL
    ).populate('user', ['name', 'avatar'])

    if(!profile) return res.status(400).json({ msg:'Profile not found'})

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    if(err.kind == 'ObjectId'){
      return res.status(400).json({ msg:'Profile not found' })
    }
    res.status(500).json({ msg:'server error' })
  }
})


// @route    DELETE api/profile
// @desc     delete a user, his posts & profiles
// @access   private
router.delete('/', auth, async (req, res) => {
  try {
    // remove user's posts
    await Post.deleteMany({ user: req.user.id })
    // remove user and his profile
    await Profile.findOneAndDelete({ user: req.user.id })
    await User.findOneAndDelete({ _id: req.user.id })
    
    res.json({ msg:"user deleted" })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg:'server error' })
  }
})


// @route    PUT api/profile/experience
// @desc     add experience
// @access   private
router.put('/experience', 
  [
    auth, 
    [  // the 2nd middleware
      check('title','title is required').not().isEmpty(),
      check('company','company is required').not().isEmpty(),
      check('from','from is required').not().isEmpty(),
    ]
  ], 
  async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() })
  }

  // destructure the data that user submit
  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }
  
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    
    profile.experience.unshift(newExp) //put newExp in the front of profile.experience (profile.experience is an array)
    
    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg:'server error' })
  }
})


// @route    DELETE api/profile/experience/:exp_id
// @desc     delete experience according to exp_id
// @access   private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    // get the to-be-removed experience index, according to exp_id
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

    // splice(index,1) remove 1 element starting from the given index
    profile.experience.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg:'server error' })
  }
})


// @route    PUT api/profile/education
// @desc     add education
// @access   private
router.put('/education', 
  [
    auth, 
    [  // the 2nd middleware
      check('school','school is required').not().isEmpty(),
      check('degree','degree is required').not().isEmpty(),
      check('from','from is required').not().isEmpty(),
    ]
  ], 
  async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() })
  }

  // destructure the data that user submit
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }
  
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    
    profile.education.unshift(newEdu) 
    
    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg:'server error' })
  }
})


// @route    DELETE api/profile/education/:exp_id
// @desc     delete education according to exp_id
// @access   private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    // get the to-be-removed edu index, according to edu_id
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

    // splice(index,1) remove 1 element starting from the given index
    profile.education.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg:'server error' })
  }
})



module.exports = router