var debugging = false;



exports.responseMessages =function() {

    define(exports.responseMessages, 'PARAMETER_MISSING',                     'Some parameter missing.');
    define(exports.responseMessages, 'INVALID_ACCESS_TOKEN',                  'invalid access token');
    define(exports.responseMessages, 'INVALID_EMAIL_ID',                      'Invalid email id.');
    define(exports.responseMessages, 'INCORRECT_PASSWORD',                     'Incorrect Password.');
    define(exports.responseMessages, 'ACTION_COMPLETE',                       'Action complete.');
    define(exports.responseMessages, 'LOGIN_SUCCESSFULLY',                    'Logged in successfully.');
    define(exports.responseMessages, 'SHOW_ERROR_MESSAGE',                    'Show error message.');
    define(exports.responseMessages, 'SHOW_PROMOCODE_ERROR_MESSAGE',          'Promocode already exists.');
    define(exports.responseMessages, 'IMAGE_FILE_MISSING',                    'Image file is missing.');
    define(exports.responseMessages, 'ERROR_IN_EXECUTION',                    'Error in execution.');
    define(exports.responseMessages, 'UPLOAD_ERROR',                          'Error in uploading.');
    define(exports.responseMessages, 'INVALID_BLOCK_STATUS',                  'Invalid block status.');
    define(exports.responseMessages, 'STATUS_CHANGED_SUCCESSFULLY',           'Status changed successfully.');
    define(exports.responseMessages, 'USER_NOT_FOUND',                        'User not found.');
    define(exports.responseMessages, 'USER_DELETED_SUCCESSFULLY',             'User deleted successfully.');
    define(exports.responseMessages, 'PASSWORD_CHANGED_SUCCESSFULLY',         'Password changed successfully.');
    define(exports.responseMessages, 'EMAIL_REGISTERED_ALREADY_AS_CUSTOMER',  'Email already registered as customer');
    define(exports.responseMessages, 'EMAIL_ALREADY_EXISTS',                  'Email already registered');
    define(exports.responseMessages, 'EXPIRED_TOKEN',                         'This link has been expired.');
};
var myContext = this;

function define(obj, name, value) {
    Object.defineProperty(obj, name, {
        value: value,
        enumerable: true,
        writable: false,
        configurable: true
    });
}


exports.responseFlags = function() {
    //FOR MESSAGES
    


    //FOR FLAGS
    define(exports.responseFlags, 'PARAMETER_MISSING',                   100);
    define(exports.responseFlags, 'INVALID_ACCESS_TOKEN',                101);
    define(exports.responseFlags, 'INVALID_EMAIL_ID',                    201);
    define(exports.responseFlags, 'WRONG_PASSWORD',                      201);
    define(exports.responseFlags, 'ACTION_COMPLETE',                     200);
    define(exports.responseFlags, 'LOGIN_SUCCESSFULLY',                  200);
    define(exports.responseFlags, 'SHOW_ERROR_MESSAGE',                  201);
    define(exports.responseFlags, 'IMAGE_FILE_MISSING',                  102);
    define(exports.responseFlags, 'ERROR_IN_EXECUTION',                  404);;
    define(exports.responseFlags, 'INVALID_CAR_TYPE',                    103);
    define(exports.responseFlags, 'UPLOAD_ERROR',                        201);
    define(exports.responseFlags, 'INVALID_BLOCK_STATUS',                104);
    define(exports.responseFlags, 'STATUS_CHANGED_SUCCESSFULLY',         200);
    define(exports.responseFlags, 'USER_NOT_FOUND',                      201);
    define(exports.responseFlags, 'USER_DELETED_SUCCESSFULLY',           200);
    define(exports.responseFlags, 'PASSWORD_CHANGED_SUCCESSFULLY',       200);
    return 1;
}

exports.makeMeDriverFlag = {};
define(exports.makeMeDriverFlag, "UNAPPROVED",                 1);
define(exports.makeMeDriverFlag, "APPROVED",                   0);
define(exports.makeMeDriverFlag, "INVALID",                                 -1);

exports.registeredAsFlag = {};
define(exports.registeredAsFlag, "DRIVER",                     1);
define(exports.registeredAsFlag, "CUSTOMER",                   0);

define(exports, "SCHEDULE_CANCEL_LIMIT",                    20);
define(exports, "DELETED_STATUS",                           1);
define(exports, "BLOCKED_STATUS",                           1);
define(exports, "REGISTRATION_DRIVER_STATUS",               1);
define(exports, "LIMO_CAR_FLAG",                            0);
define(exports, "VAN_CAR_FLAG",                             1);

//BLOCK/UNBLOCK
define(exports, "BLOCK_STATUS",                             1);
define(exports, "UNBLOCK_STATUS",                           0);

//INITIAL LAT/LONG FOR DRIVER
define(exports, "INITIAL_LATITUDE",                            0);
define(exports, "INITIAL_LONGITUDE",                           0);





exports.userFreeStatus = {};
define(exports.userFreeStatus, "FREE",    0);
define(exports.userFreeStatus, "BUSY",    1);

exports.userVerificationStatus = {};
define(exports.userVerificationStatus, "VERIFY",                     1);
define(exports.userVerificationStatus, "NOTVERIFY",                  0);

exports.sessionStatus = {};
define(exports.sessionStatus, "INACTIVE",   0);
define(exports.sessionStatus, "ACTIVE",     1);
define(exports.sessionStatus, "TIMED_OUT",  2);


exports.userRegistrationStatus = {};
define(exports.userRegistrationStatus, "CUSTOMER",          0);
define(exports.userRegistrationStatus, "Consultant",            1);
define(exports.userRegistrationStatus, "Admin",  2);

exports.rideAcceptanceFlag = {};
define(exports.rideAcceptanceFlag, "NOT_YET_ACCEPTED",          0);
define(exports.rideAcceptanceFlag, "ACCEPTED",                  1);
define(exports.rideAcceptanceFlag, "ACCEPTED_THEN_REJECTED",    2);

exports.notificationFlags = {};
define(exports.notificationFlags, "REQUEST",                        0 );  //driver
define(exports.notificationFlags, "REQUEST_TIMEOUT",                1 );  //driver
define(exports.notificationFlags, "REQUEST_CANCELLED",              2 );  //driver

define(exports.notificationFlags, "CHANGE_STATE",                   20);
define(exports.notificationFlags, "DISPLAY_MESSAGE",                21);
define(exports.notificationFlags, "TOGGLE_LOCATION_UPDATES",        22);
define(exports.notificationFlags, "MANUAL_ENGAGEMENT",              23);
define(exports.notificationFlags, "HEARTBEAT",                      40);
define(exports.notificationFlags, "STATION_CHANGED",                50);

exports.deviceType = {};
define(exports.deviceType, "ANDROID",   0);
define(exports.deviceType, "iOS",       1);