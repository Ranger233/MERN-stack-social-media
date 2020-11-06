const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User' // the profile data is connected to user data
  },
  company:{
    type: String
  },
  website:{
    type: String
  },
  location:{
    type: String
  },
  status:{
    type: String,
    required: true
  },
  skills:{
    type: [String]
  },
  bio:{
    type: String
  },
  githubusername:{
    type: String
  },
  experience:[
    {
      title:{
        type: String
      },
      company:{
        type: String
      },
      location:{
        type: String
      },
      from:{
        type: Date,
        required: true
      },
      to:{
        type: Date,
      },
      current:{
        type: Boolean,
        default: false
      },
      description:{
        type: String
      }
    }
  ],
  education:[
    {
      school:{
        type: String,
        required: true
      },
      degree:{
        type: String
      },
      fieldofstudy:{
        type: String
      },
      from:{
        type: Date
      },
      to:{
        type:Date
      },
      current:{
        type: Boolean
      },
      description:{
        type: String
      }
    }
  ],
  social:{
    youtube:{
      type: String
    },
    twitter:{
      type: String
    },
    facebook:{
      type: String
    },
    linkedin:{
      type: String
    },
    instagram:{
      type: String
    }
  },
  date:{
    type: Date,
    default: Date.now
  }
})

module.exports = Profile = mongoose.model('profile', profileSchema)