import mongoose from "mongoose";

const synapseUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateKey: { type: String, required: true }, // YYYY-MM-DD
    count: { type: Number, default: 0 },
  },
  { timestamps: true },
);

synapseUsageSchema.index({ userId: 1, dateKey: 1 }, { unique: true });

export default mongoose.model("SynapseUsage", synapseUsageSchema);
