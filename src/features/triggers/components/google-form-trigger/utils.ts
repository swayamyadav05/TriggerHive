export const generateGoogleFormScript = (
  webhookUrl: string,
  webhookSecret: string
) => `function onFormSubmit(e) {
  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();

  // Build responses object
  var responses = {};
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    responses[itemResponse.getItem().getTitle()] = itemResponse.getResponse();
  }

  // Prepare webhook payload
  var payload = {
    formId: e.source.getId(),
    formTitle: e.source.getTitle(),
    responseId: formResponse.getId(),
    timestamp: formResponse.getTimestamp(),
    respondentEmail: formResponse.getRespondentEmail(),
    responses: responses
  };

  var payloadString = JSON.stringify(payload);
  
  // Generate HMAC-SHA256 signature
  var WEBHOOK_SECRET = '${webhookSecret}';
  var signature = Utilities.computeHmacSha256Signature(payloadString, WEBHOOK_SECRET);
  var signatureHex = signature.map(function(byte) {
    var hex = (byte < 0 ? byte + 256 : byte).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');

  // Send to webhook with signature
  var WEBHOOK_URL = '${webhookUrl}';
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'x-webhook-signature': signatureHex
    },
    'payload': payloadString
  };

  try {
    var response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    Logger.log('Webhook success: ' + response.getResponseCode());
  } catch(error) {
    Logger.log('Webhook failed: ' + error);
  }
}`;
