document.addEventListener("DOMContentLoaded", () => {

  const mapElement = document.getElementById("route-map");

  if (!mapElement) {
    return;
  }

  const gpxUrl = mapElement.dataset.gpx;

  if (!gpxUrl) {
    return;
  }


  /*
   * Create map
   */

  const map = L.map(mapElement,{
    minZoom: 4,
    maxZoom: 9
});


  /*
   * OpenStreetMap tiles
   */

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19
  }).addTo(map);


  /*
   * Load GPX
   */

  fetch(gpxUrl)
    .then(response => {

      if (!response.ok) {
        throw new Error(`Could not load GPX: ${response.status}`);
      }

      return response.text();

    })

    .then(gpxText => {

      const parser = new DOMParser();
      const gpx = parser.parseFromString(gpxText, "application/xml");

      const points = [];

      const trackPoints = gpx.querySelectorAll("trkpt");

      trackPoints.forEach(point => {

        const lat = parseFloat(point.getAttribute("lat"));
        const lon = parseFloat(point.getAttribute("lon"));

        if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
          points.push([lat, lon]);
        }

      });


      if (!points.length) {
        throw new Error("No track points found in GPX");
      }


      /*
       * Draw route
       */

      const route = L.polyline(points, {
        color: "#111",
        weight: 4,
        opacity: 0.9,
        lineJoin: "round",
        lineCap: "round"
      }).addTo(map);


      /*
       * Fit map to route
       */

      map.fitBounds(route.getBounds(), {
        padding: [30, 30]
      });

    })

    .catch(error => {

      console.error("Pyrimoto GPX:", error);

      mapElement.innerHTML = "";

      const message = document.createElement("p");

      message.textContent = "No s'ha pogut carregar la ruta.";

      mapElement.appendChild(message);

    });

});
