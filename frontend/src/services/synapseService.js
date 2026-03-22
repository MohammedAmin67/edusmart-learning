import API from "../api/axios";

const synapseService = {
  ask: async (message, { isPreset = false } = {}) => {
    const res = await API.post("/synapse/ask", {
      message,
      context: { isPreset },
    });
    return res.data;
  },
};

export default synapseService;
