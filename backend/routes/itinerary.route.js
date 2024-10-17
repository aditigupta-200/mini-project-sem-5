// backend/routes/itinerary.route.js
import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import Itinerary from "../models/itinerary.model.js";
import Post from "../models/post.model.js";

const router = express.Router();

// Add destination to itinerary
router.post("/add", protectRoute, async (req, res) => {
  try {
    const { destinationId } = req.body;
    let itinerary = await Itinerary.findOne({ 
      user: req.user._id,
      status: 'draft'
    });

    if (!itinerary) {
      itinerary = new Itinerary({
        user: req.user._id,
        destinations: [destinationId]
      });
    } else {
      if (!itinerary.destinations.includes(destinationId)) {
        itinerary.destinations.push(destinationId);
      }
    }

    await itinerary.save();
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Generate itinerary plan
router.post("/build", protectRoute, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ 
      user: req.user._id,
      status: 'draft'
    }).populate('destinations');

    if (!itinerary) {
      return res.status(404).json({ error: "No draft itinerary found" });
    }

    // Generate day-wise plan based on locations and seasons
    const destinations = itinerary.destinations;
    let plan = "Your Travel Itinerary\n\n";

    // Group destinations by location for better planning
    const locationGroups = destinations.reduce((groups, dest) => {
      if (!groups[dest.location]) {
        groups[dest.location] = [];
      }
      groups[dest.location].push(dest);
      return groups;
    }, {});

    let dayCount = 1;
    for (const location in locationGroups) {
      plan += `Day ${dayCount} - ${location}\n`;
      const destinationsInLocation = locationGroups[location];
      
      destinationsInLocation.forEach(dest => {
        plan += `- Visit ${dest.placeName}\n`;
        plan += `  Best Season: ${dest.bestSeasonToVisit}\n`;
        if (dest.text) {
          plan += `  Note: ${dest.text}\n`;
        }
        plan += `  Rating: ${dest.rating}/5\n\n`;
      });
      
      dayCount++;
    }

    itinerary.generatedPlan = plan;
    itinerary.status = 'generated';
    await itinerary.save();

    res.status(200).json({ plan });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current itinerary
router.get("/current", protectRoute, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ 
      user: req.user._id,
      status: 'draft'
    }).populate('destinations');
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;