export const handler = async (event) => {
  try {
      const request = event.Records[0].cf.request;

      console.log("-----------------------------");
      console.log("Lambda@Edge invoked for URI:", request.uri);
      console.log("Full event:", JSON.stringify(event, null, 2));

      // Must return request object for Viewer Request
      return request;
  } catch (err) {
      console.log("Error caught in Lambda@Edge:", err);

      // Return original request to avoid breaking CloudFront
      return event.Records[0].cf.request;
  }
};