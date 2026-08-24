import { api } from "./api";

let homepageContentRequest: Promise<any> | null = null;

export const getHomepageSuccessContent = () => {
  if (!homepageContentRequest) {
    const request = api.publicGetFresh("/api/success-stories/homepage");
    homepageContentRequest = request;
    const clearRequest = () => {
      if (homepageContentRequest === request) homepageContentRequest = null;
    };
    void request.then(clearRequest, clearRequest);
  }
  return homepageContentRequest;
};
