
function isNumber(e) {
    var iKeyCode = e.charCode ? e.charCode : e.keyCode;
    var key_char = e.KeyChar;
    if (iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57)) {
        return false;
    }
    return true;
}
function alphaOnly(e) {
    var iKeyCode = e.charCode ? e.charCode : e.keyCode;
    var key_char = e.KeyChar;
    if (iKeyCode > 31 && (iKeyCode < 97 || iKeyCode > 122) && (iKeyCode < 65 || iKeyCode > 90 )) {
        return false;
    }
    return true;
}
function alphaWithSpace(e) {
    var iKeyCode = e.charCode ? e.charCode : e.keyCode;
    var key_char = e.KeyChar;
    if (iKeyCode > 31 && iKeyCode!=32 && (iKeyCode < 97 || iKeyCode > 122) && (iKeyCode < 65 || iKeyCode > 90 )) {
        console.log("hel");
        return false;
    }
    return true;
}
function dontLetUserType(e) {
    //var iKeyCode = e.charCode ? e.charCode : e.keyCode;
    //var key_char = e.KeyChar;
    //if (iKeyCode > 31 && iKeyCode!=32 && (iKeyCode < 97 || iKeyCode > 122) && (iKeyCode < 65 || iKeyCode > 90 )) {
    //    console.log("hel");
    //    return false;
    //}
    return false;
}
function addressRegex (evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;

    var regex = /[0-9a-zA-Z# /-]|\./;
    if(key ==24 || key == 25 || key == 26 || key == 27 || key == 8 || key == 9||key==46) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
        key = String.fromCharCode (key);
        if(key==".")return false;
        return;
    }
    key = String.fromCharCode (key);
    if ( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
    }
}
function emailRegex (evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    var regex = /[0-9a-zA-Z_ +@-]|\./;
    if(key ==24 || key == 25 || key == 26 || key == 27 || key == 8 || key == 9||key==46) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
        key = String.fromCharCode (key);
        //if(key==".")return false;
        return;
    }
    key = String.fromCharCode (key);
    if ( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
    }
}
var specialKeys = new Array();
specialKeys.push(8); //Backspace
//        specialKeys.push(9); //Tab
specialKeys.push(46); //Delete
specialKeys.push(36); //Home
specialKeys.push(35); //End
specialKeys.push(37); //Left
specialKeys.push(39); //Right
function IsAlphaNumeric(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    var ret = (((keyCode ==32))||(keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));

    return ret;
}
