const multer = require('multer')

const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users/profile')
  },
  filename: (req, file, cb) => {
    const filenameArray = file.originalname.split('.')
    const extension = filenameArray[filenameArray.length - 1]
    cb(null, `image-${Date.now()}.${extension}`)
  },
})

module.exports = profilePicStorage