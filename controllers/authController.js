const jwt = require("jsonwebtoken");
// const { noExtendLeft } = require("sequelize/types/lib/operators");
const { user } = require("../models");

class AuthController {
  async getToken(req, res, next) {
    try {
      const body = {
        id: req.user.id,
        role: req.user.role,
        email: req.user.email,
      };
      const token = jwt.sign(
        {
          user: body,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
        { algorithm: "RS256" }
      );
      return res.status(200).json({
        message: "success",
        token,
      });
    } catch (e) {
      return next(e);
    }
  }
}

module.exports = new AuthController();
