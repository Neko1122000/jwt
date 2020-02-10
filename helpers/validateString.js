const PasswordValidate = require('password-validator');
const validator = require('validator');

exports.passwordValidate = async (password) =>{
    if (!password) return false;
    const validator = new PasswordValidate();
    validator
        .is().min(8)                                    // Minimum length 8
        .is().max(20)                                  // Maximum length 20
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        .has().digits()                                 // Must have digits
        .has().not().spaces();
    return (validator.validate(password));
};

exports.validateEmail = async(email) => {
    if (!email) return null;
    return (validator.isEmail(email));
};