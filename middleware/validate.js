module.exports = (requiredFields) => {
  return (req, res, next) => {
    for (let field of requiredFields) {
      if (req.body[field] === undefined) {
        return res.status(400).json({
          message: `${field} is required`
        });
      }
    }
    next();
  };
};
