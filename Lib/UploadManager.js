var Config = require('../Config');
var UniversalFunctions = require('../Utils/UniversalFunctions');
var async = require('async');
var Path = require('path');
var knox = require('knox');
var fsExtra = require('fs-extra');


function uploadFile(fileData, userId, type, callbackParent) {
    //Verify File Data
    var imageURL = {
        original: null,
        thumbnail: null
    };
    var logoURL = {
        original: null,
        thumbnail: null
    };
    var documentURL = null;

    var originalPath = null;
    var thumbnailPath = null;
    var dataToUpload = [];

    async.series([
        function (cb) {
            //Validate fileData && userId
            if (!userId || !fileData || !fileData.originalname) {
              //  console.log('in upload file to s3',userId,fileData)
                cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
            } else {
                // TODO Validate file extensions
                cb();
            }
        }, function (cb) {
            //Set File Names
            imageURL.original = UniversalFunctions.getFileNameWithUserIdWithCustomPrefix(false, fileData.originalname, type,  userId);
            imageURL.thumbnail = UniversalFunctions.getFileNameWithUserIdWithCustomPrefix(true, fileData.originalname, type, userId);
            cb();
        },
        function (cb) {
            //Save File
            var path = Path.resolve(".") + "/uploads/" + imageURL.original;
            saveFile(fileData.path, path, function (err, data) {
                cb(err, data)
            })
        },
        function (cb) {
            //Create Thumbnail if its a logo
            originalPath = Path.resolve(".") + "/uploads/" + imageURL.original;
            dataToUpload.push({
                originalPath: originalPath,
                nameToSave: imageURL.original
            });
                cb();
        }
    ], function (err, result) {
            callbackParent(err, imageURL)
    });
}

function saveFile(fileData, path, callback) {
    fsExtra.copy(fileData, path, callback);
}

module.exports = {

    uploadFile: uploadFile
};