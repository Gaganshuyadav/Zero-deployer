// export const handler = async (event) => {
//   try {
//       const request = event.Records[0].cf.request;

//       console.log("-----------------------------");
//       console.log("Lambda@Edge invoked for URI:", request.uri);
//       console.log("Full event:", JSON.stringify(event, null, 2));

//       // Must return request object for Viewer Request
//       return request;
//   } catch (err) {
//       console.log("Error caught in Lambda@Edge:", err);

//       // Return original request to avoid breaking CloudFront
//       return event.Records[0].cf.request;
//   }
// };

'use strict';

// Example request paths:
// /z312x/weather → /all-proj-builds/z312x/index.html
// /z312x/static/js/main.js → /all-proj-builds/z312x/static/js/main.js
// /z312x/manifest.json → /all-proj-builds/z312x/manifest.json

export const handler = async (event) => {
  
    const request = event.Records[0].cf.request;
    let uri = request.uri || "/";

    // Normalize
    if (!uri.startsWith("/")) uri = "/" + uri;

    // If root → let user handle separately (homepage)
    if (uri === "/") {
        return request;
    }

    // Extract projectId = first segment
    const parts = uri.split("/").filter(Boolean);
    const projectId = parts[0]; // z31abc / z312x / etc.

    // Validate projectId: alphanumeric + hyphen + underscore
    if (!/^[\w-]+$/.test(projectId)) {
        // Not a valid project → let CloudFront pass normally
        return request;
    }

    // Build rest of path after projectId
    const rest = "/" + parts.slice(1).join("/"); // "/weather", "/static/js/main.js", ...
    const fileName = rest.split("/").pop();
    const hasExt = fileName.includes(".");

    // CASE 1: Static asset → deliver normally
    if (hasExt) {
        request.uri = `/all-proj-builds/${projectId}${rest}`;
        return request;
    }

    // CASE 2: Folder or SPA route → return index.html
    request.uri = `/all-proj-builds/${projectId}/index.html`;
    return request;
};