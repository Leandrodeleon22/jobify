import { UnauthenticatedError } from "../errors/index.js";

const checkPermission = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnauthenticatedError("Not Authorized to access this Route");
};

export default checkPermission;
