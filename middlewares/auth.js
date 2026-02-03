const {getUser} =require('../service/auth')
async function restrictToLoggedinUser(req ,res ,next){
    const userUid =req.cookies?.uid;
    // console.log("User UID from cookies:", userUid);
     if(!userUid) return res.redirect("/login")

    const user =await getUser(userUid)
    // console.log("Authenticated User:", user);
    if (!user) return res.redirect("/login")
        
        req.user =user;
        next();
   
}

async function checkAuth(req ,res ,next){
    const userUid =req.cookies?.uid;
    const user =await getUser(userUid)
    req.user =user;
    next();
   
}
module.exports ={
    restrictToLoggedinUser,
    checkAuth
}