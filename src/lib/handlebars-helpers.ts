import Handlebars from "handlebars";

// Register the json helper for pretty-printing JSON objects
Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

// Register helper to safely access nested properties with special characters
// Usage: {{get googleForm.responses "Your Name"}}
// Usage: {{get googleForm.responses "What can we improve?"}}
Handlebars.registerHelper("get", function (obj, key) {
  if (!obj || typeof obj !== "object") {
    return "";
  }
  return obj[key as keyof typeof obj] || "";
});

// Register helper to access deeply nested properties
// Usage: {{nested customerData "httpResponse.data.data.name"}}
Handlebars.registerHelper("nested", function (obj, path) {
  if (!obj || typeof path !== "string") {
    return "";
  }

  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === "object") {
      current = (current as Record<string, unknown>)[key];
    } else {
      return "";
    }
  }

  return current || "";
});

// Register helper specifically for form responses (more user-friendly)
// Usage: {{response "Your Name"}}
// Note: This requires 'googleForm' to be in context
Handlebars.registerHelper(
  "response",
  function (this: Record<string, unknown>, questionName: string) {
    const googleForm = this.googleForm as
      | Record<string, unknown>
      | undefined;
    if (
      !googleForm?.responses ||
      typeof googleForm.responses !== "object" ||
      !googleForm.responses
    ) {
      return "";
    }
    return (
      (googleForm.responses as Record<string, unknown>)[
        questionName
      ] || ""
    );
  }
);

// Register helper for Stripe data access
// Usage: {{stripe "productName"}}
Handlebars.registerHelper(
  "stripe",
  function (this: Record<string, unknown>, key: string) {
    const stripe = this.stripe as Record<string, unknown> | undefined;
    if (!stripe || typeof stripe !== "object") {
      return "";
    }
    return stripe[key] || "";
  }
);

// Register a generic lookup helper for any nested path
// Usage: {{lookup "googleForm.responses['Your Name']"}}
Handlebars.registerHelper(
  "lookup",
  function (this: Record<string, unknown>, path: string) {
    const keys = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: unknown = this;

    for (const key of keys) {
      // Handle bracket notation like responses['Your Name']
      const bracketMatch = key.match(/^(.+?)\['(.+?)'\]$/);
      if (bracketMatch) {
        const [, objKey, subKey] = bracketMatch;
        current = (current as Record<string, unknown>)?.[objKey];
        current = (current as Record<string, unknown>)?.[subKey];
      } else {
        current = (current as Record<string, unknown>)?.[key];
      }

      if (current === undefined || current === null) {
        return "";
      }
    }

    return current;
  }
);

export function registerHandlebarsHelpers() {
  // This function is called to ensure helpers are registered
  // The registration happens at module load time via the code above
  return true;
}
