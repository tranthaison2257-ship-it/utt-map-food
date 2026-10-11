function extractCoordinatesFromText(value) {
  var texts = [String(value || "")];
  try {
    texts.push(decodeURIComponent(texts[0]));
  } catch (error) {
    // Keep parsing the original URL when it contains malformed escapes.
  }

  var patterns = [
    /[?&](?:q|ll|query|center)=\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    /!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/,
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /\/search\/(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i
  ];

  for (var textIndex = 0; textIndex < texts.length; textIndex++) {
    for (var patternIndex = 0; patternIndex < patterns.length; patternIndex++) {
      var match = texts[textIndex].match(patterns[patternIndex]);
      if (!match) continue;

      var lat = parseFloat(match[1]);
      var lng = parseFloat(match[2]);
      if (patternIndex === 2) {
        var longitude = lat;
        lat = lng;
        lng = longitude;
      }

      if (isFinite(lat) && isFinite(lng) &&
          Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
        return { lat: lat, lng: lng };
      }
    }
  }

  return null;
}

function getRedirectUrl(url, location) {
  if (/^https?:\/\//i.test(location)) return location;
  if (location.indexOf("//") === 0) return "https:" + location;

  var origin = url.match(/^(https?:\/\/[^/]+)/i);
  if (!origin) return null;
  if (location.charAt(0) === "/") return origin[1] + location;

  var path = url.replace(/[?#].*$/, "");
  return path.substring(0, path.lastIndexOf("/") + 1) + location;
}

function extractLatLngFromUrl(url) {
  if (typeof url !== "string" || !url.trim()) {
    throw new Error("Thiếu link Google Maps.");
  }

  var currentUrl = url.trim();
  var coordinates = extractCoordinatesFromText(currentUrl);
  if (coordinates) return coordinates;

  var isShortLink = /^https?:\/\/(?:www\.)?(?:maps\.app\.)?goo\.gl(?:\/|$)/i.test(currentUrl);
  if (!isShortLink) return { lat: 0, lng: 0 };

  for (var redirectCount = 0; redirectCount < 6; redirectCount++) {
    var response = UrlFetchApp.fetch(currentUrl, {
      followRedirects: false,
      muteHttpExceptions: true
    });
    var statusCode = response.getResponseCode();
    var headers = response.getHeaders();
    var location = headers.Location || headers.location;

    if (statusCode >= 300 && statusCode < 400 && location) {
      var nextUrl = getRedirectUrl(currentUrl, String(location));
      if (!nextUrl || nextUrl === currentUrl) break;
      currentUrl = nextUrl;
      coordinates = extractCoordinatesFromText(currentUrl);
      if (coordinates) return coordinates;
      continue;
    }

    coordinates = extractCoordinatesFromText(response.getContentText());
    if (coordinates) return coordinates;
    break;
  }

  return { lat: 0, lng: 0 };
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var coordinates = extractLatLngFromUrl(data.mapUrl);
    if (coordinates.lat === 0) {
      return jsonResponse({
        status: "error",
        message: "Không tìm thấy tọa độ trong link Google Maps. Hãy dùng link chia sẻ địa điểm có tọa độ hoặc nhập link Google Maps đầy đủ."
      });
    }

    var randomId = Math.floor(Math.random() * 1000) + 100;
    var dishesArray = String(data.signatureDishes || "").split(",").map(function(item) {
      return item.trim();
    }).filter(function(item) {
      return item.length > 0;
    });
    var formattedString = `
  {
    id: ${randomId},
    name: ${JSON.stringify(data.name)},
    category: ${JSON.stringify(data.category)},
    categoryLabel: ${JSON.stringify(data.categoryLabel)},
    priceRange: ${JSON.stringify(data.priceRange)},
    minPrice: ${Number(data.minPrice)},
    maxPrice: ${Number(data.maxPrice)},
    distanceText: ${JSON.stringify(data.distanceText || "")},
    address: ${JSON.stringify(data.address || "")},
    phone: ${JSON.stringify(data.phone || "")},
    openHours: ${JSON.stringify(data.openHours || "")},
    lat: ${coordinates.lat},
    lng: ${coordinates.lng},
    coverImage: ${JSON.stringify(data.coverImage || "")},
    signatureDishes: ${JSON.stringify(dishesArray)}
  },`;

    var docId = "1sGUHy8NbP7U8u_sCxe8NJkPN2btiJ_-w77PkmkK-Vq4";
    var doc = DocumentApp.openById(docId);
    doc.getBody().appendParagraph(formattedString);
    doc.getBody().appendHorizontalRule();

    return jsonResponse({
      status: "success",
      extractedLat: coordinates.lat,
      extractedLng: coordinates.lng
    });
  } catch (error) {
    return jsonResponse({
      status: "error",
      message: error && error.message ? error.message : String(error)
    });
  }
}
