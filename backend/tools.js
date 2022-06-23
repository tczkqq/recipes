module.exports = {
    function isAuthorized(req) {
        if (!isSessionInitialized(req)) return false;
        return req.session.loggedIn;
    }

    function isSessionInitialized(req) {
        if (
            typeof req.session.loggedIn !== 'undefined' ||
            typeof req.session.username !== 'undefined' ||
            typeof req.session.type !== 'undefined'
        ) {
            return false;
        }

        return true;
    }

    function isAdmin(req) {
        if (
            !isSessionInitialized(req) ||
            !isAuthorized(req)
        ) return false;
        
        return req.sesson.type === '1';
}
}


