function checkPermission(requiredRoles) {
    return (req, res, next) => {
            console.log(req.user)

        const userRole = req.user.role.uuid; // assuming you add user info in req.user after login
        if (requiredRoles.includes(userRole)) {
            return next();
        }
        return res.status(403).json({ message: "You don't have permission" });
    };
}


module.exports ={checkPermission}