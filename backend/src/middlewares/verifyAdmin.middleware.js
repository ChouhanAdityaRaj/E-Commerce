import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user?.isAdmin) {
      throw new ApiError(403, "Access denied");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export {verifyAdmin}
