const User = require('../Models/User');
async function adminMiddleware(req, res, next) {
try {
if (!req.user || !req.user.userId) {
return res.status(401).json({
message: 'Authentication required.'
});
}

// Fetch the user's current role directly from MongoDB.
const user = await User.findById(req.user.userId).select('role');

if (!user) {
  return res.status(401).json({
    message: 'User account not found.'
  });
}

if (user.role !== 'admin') {
  return res.status(403).json({
    message: 'Access denied. Administrator privileges are required.'
  });
}

req.admin = user;
next();

} catch (error) {
console.error('Admin authorization error:', error.message);

return res.status(500).json({
  message: 'Unable to verify administrator permissions.'
});

}
}

module.exports = adminMiddleware;
