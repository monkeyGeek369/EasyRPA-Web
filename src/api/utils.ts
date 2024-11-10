export const baseUrlApi = (url: string) => `/easyrpa/${url}`;

export const buildRequestModel = function <T>(data: T) {
  return {
    header: {
      user_id: 1,
      trace_id: "49058e97-e3bd-47b7-985b-3c0833556930",
      req_time: new Date()
    },
    model: data
  };
};
