// backend/models/itinerary.model.js
import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destinations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    }],
    generatedPlan: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['draft', 'generated'],
      default: 'draft'
    }
  },
  { timestamps: true }
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);
export default Itinerary;