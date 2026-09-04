

export const isDemo = async (req, res, next) => {
    try{
    const user = req.user;
    console.log("Checking demo user in middleware:", user);
    if(user?.email === 'demorecruiter@gmail.com' || user?.email === 'democandidate@gmail.com') {
        return res.status(403).json({ error: "Operation not allowed for demo user." });
    }
    next();
}catch(e){
    // console.log("Error in demoauth middleware", e);
    return res.status(500).json({ error: "Server error checking demo." });
}
} 