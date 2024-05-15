const multer = require("multer");
const path = require('path');

// Image Storage
const imageStorage = multer.diskStorage({
    destination: "public/uploads/images",
    filename: function (req, file, cb) {
        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );
    },
});

const uploadImage = multer({
    storage: imageStorage,
    fileFilter: function (req, file, cb) {
        checkImageFileType(file, cb);
    }
}).single("logo");

function checkImageFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (!mimetype && !extname) return cb(new Error('Invalid image file type'));
    cb(null, true);
}


// Audio Storage
const audioStorage = multer.diskStorage({
    destination: "public/uploads/audios",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadAudio = multer({
    storage: audioStorage,
    fileFilter: function (req, file, cb) {
        checkAudioFileType(file, cb);
    }
}).fields([
    { name: 'welcomeMessage', maxCount: 1 },
    { name: 'voicemailMessage', maxCount: 1 }
]);

function checkAudioFileType(file, cb) {
    const filetypes = /mpeg|mp3|mpga/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (!mimetype && !extname) return cb(new Error('Invalid audio file type'));
    cb(null, true);
}


module.exports = {
    uploadImage,
    uploadAudio
    // uploadWelcomeAudio,
    // uploadVoicemailAudio
};