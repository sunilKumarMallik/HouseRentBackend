const jwt = require('jsonwebtoken')

exports.verifyToken = (req,res,next) => {
    let bearerToken;
  const tokenHeader = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization']
  console.log("verifyToken",tokenHeader)
  if(typeof tokenHeader!=='undefined'){
    const bearer= tokenHeader.split(' ')
    bearerToken = bearer[1]
  }
  console.log("bearer token",bearerToken)
  // decode token
  if (bearerToken) {
    // verifies secret and checks exp
    jwt.verify(bearerToken, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            console.log("error",err)
            return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
        }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        "error": true,
        "message": 'No token provided.'
    });
  }
}