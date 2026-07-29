import { api } from "./api";

let homepageContentRequest: Promise<any> | null = null;

export const getHomepageSuccessContent = () => {
  if (!homepageContentRequest) {
    homepageContentRequest = api.publicGet("/api/success-stories/homepage").then((response) => {
      if (!response?.success) homepageContentRequest = null;
      return response;
    });
  }
  return homepageContentRequest;
};
