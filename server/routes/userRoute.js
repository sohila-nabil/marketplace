import { Router } from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
  updateUser,
  deleteUser,
  userListings,
  getUser,
} from "../controllers/userCtrl.js";
const userRouter = Router();

userRouter.put("/update/:id", verifyUser, updateUser);
userRouter.delete("/delete/:id", verifyUser, deleteUser);
userRouter.get("/listings/:id", verifyUser, userListings);
userRouter.get("/get-user/:id", verifyUser, getUser);

export default userRouter;
