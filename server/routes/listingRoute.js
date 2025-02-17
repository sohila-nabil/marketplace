import { Router } from "express";
import {
  createListing,
  deleteListing,
  deleteOneImage,
  updateListing,
  getOneListing,
  getListings,
} from "../controllers/listingCtrl.js";
import { verifyUser } from "../utils/verifyUser.js";
const listingRouter = Router();

listingRouter.post("/create-listing", verifyUser, createListing);
listingRouter.put("/update-listing/:id", verifyUser, updateListing);
listingRouter.get("/get-listing/:id", getOneListing);
listingRouter.get("/get-listings", getListings);
listingRouter.delete("/delete-listing/:id", verifyUser, deleteListing);
listingRouter.delete("/delete-img/:id/:imageId", verifyUser, deleteOneImage);

export default listingRouter;
