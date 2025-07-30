const policies = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "data:",
    "'unsafe-inline'",
    "https://js.usemessages.com",
    "https://kpi.opom.qsysi.com",
    "https://*.tiny.cloud",
  ],
  "media-src": [
    "https://s3.us-west-2.amazonaws.com",
    "https://kpi.opom.qsysi.com",
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'",
    "data:",
    "https://cdnjs.cloudflare.com",
    "https://fonts.googleapis.com",
    "https://*.tiny.cloud",
    "https://kpi.opom.qsysi.com"
  ],
  "font-src": [
    "'self'",
    "data:",
    "https://fonts.gstatic.com",
    "https://kpi.opom.qsysi.com",
    "https://cdnjs.cloudflare.com",
  ],
  "worker-src": ["'self'"],
  "connect-src": [
    "'self'",
    "data",
    "http://localhost:3200",
    "https://js.usemessages.com",
    "https://cdnjs.cloudflare.com",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://s3.us-west-2.amazonaws.com",
    "https://s3.scriptcdn.net",
    "https://kpi.opom.qsysi.com",
    "https://*.tiny.cloud",
    "https://*.tinymce.com",
  ],
  "img-src": [
    "'self'",
    "data:",
    "https://kpi.opom.qsysi.com",
    "https://s3.us-west-2.amazonaws.com",
    "https://*.tinymce.com",
  ],
  "frame-src": ["https://docs.google.com"],
  "frame-ancestors": ["'none'"],
  "object-src": ["'none'"],
  "report-to": [`https://${process.env.HOSTNAME}/-/csp`]
};

const policyString = Object.entries(policies)
  .map(([key, value]) => `${key} ${value.join(" ")}`)
  .join("; ");

export const CSP_POLICIES = policyString;
