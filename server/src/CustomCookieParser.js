module.exports = function customCookieParser(cookieStr) {
    const splitedCookies = cookieStr.replaceAll(' ', '').split(';');
    if(!splitedCookies) return null;

    const nameAndVal = [];

    splitedCookies.forEach(cookie => {
       const nameVal = cookie.split('=');
       nameAndVal.push(nameVal)  
    });
    return Object.fromEntries(nameAndVal);
}