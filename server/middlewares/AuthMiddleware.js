import jwt from "jsonwebtoken"

export const verifyToken = (request, response, next) => {
    const token = request.cookies.jwt
    console.log({token})
    if(!token) return response.status(401).send("you are not authenticated.");
    jwt.verify(token, "jkhq2jkh31kle1ehi2h@ihiadh2345", async (err, payload) => {
        if(err) return response.status(403).send("token is not valid.")
        request.userId = payload.userId;
        next();
    })
}