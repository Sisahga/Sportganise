import { FormValues } from "@/types/trainingSessionFormValues";

const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api";

//const [data, setData] = useState<ResponseFormValues>();
//const [loading, setLoading] = useState<boolean>(true);
//const [error, setError] = useState<string | null>(null);

const trainingSessionApi = {
  /**Submit CreateTrainingSession form */
  createTrainingSession: async (url: string, jsonPayload: FormValues) => {
    const response = await fetch(`${baseMappingUrl}/programs/${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonPayload),
    });

    if (response.status === 201) {
      const data = await response.json();
      console.log("Event created successfully:", data);
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown server error" })); // try to get error details from server
      const errorMessage =
        errorData.message ||
        response.statusText ||
        "Failed to create Training Session."; // prioritize specific error messages
      throw new Error(errorMessage);
    }
    return response.json();
  },

  /* try {
      const response = await fetch(`${baseMappingUrl}/${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonPayload, null, 2),
      });
      if (response.status === 201) {
        const data = await response.json();
        setData(data);
        console.log("Event created successfully:", data);
        setLoading(false);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown server error" })); // try to get error details from server
        const errorMessage =
          errorData.message ||
          response.statusText ||
          "Failed to create Training Session."; // prioritize specific error messages
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Error posting createTrainingSession form:", err);
      setError("Failed to create Training Session.");
      setLoading(false);
    }
    return {
      error,
      data, //response.json()
      loading,
    }; */

  /**Submit ModifyTrainingSession form */
  /**Initalize ModifyTrainingSession form */
};

export default trainingSessionApi;
