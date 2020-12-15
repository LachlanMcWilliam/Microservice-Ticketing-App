import axios from "axios";

const buildClient = ({ req }) => {
  // If we are on the server
  if (typeof window === "undefined") {
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // If we are on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};

export default buildClient;
