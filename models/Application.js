const mongoose = require("mongoose");

const Application = mongoose.model("Application", {
    propertyType: { type: String, required: true },
    propertyState: { type: String, required: true },
    propertyUsage: { type: String, required: true },
    currentSituation: { type: String, required: true },
    propertyLocation: {
    country: { type: String},
    zip: { type: String},
    },
    landCost: { type: String, required: true },
    estimatedPrice: { type: String, required: true },
    renovationCost: String ,
    notaryFees: { type: String, required: true },
    totalCost: { type: String, required: true },
    emailAddress: { type: String, required: true }, 
    refNumber: { type: String },
});

module.exports = Application;
