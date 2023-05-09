mapboxgl.accessToken = 'pk.eyJ1IjoianNlcmZhc3MiLCJhIjoiY2w5eXA5dG5zMDZydDN2cG1zeXduNDF5eiJ9.6-9p8CxqQlWrUIl8gSjmNw'
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/dark-v11', // style URL
center: [-95.7129, 37.0902], // starting position [lng, lat]
zoom: 3.5, // starting zoom
pitch: 0,
//bearing: 80,
attributionControl: false,
maxBounds: [
    [-171.791110603, 18.91619], // Southwest coordinates
    [-66.96466, 71.3577635769] // Northeast coordinates
  ],
});
//listener => replaces function
map.on('load', () => {
 // Add a source for the data centers feature class.
 map.addSource('DataCenters', {
    type: 'geojson',
    data: 'data/DataCenters.geojson'
  });
  map.addLayer({
    'id': 'US Data Centers',
    'type': 'circle',
    'source': 'DataCenters',
    'paint': {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['get', 'SqFt'],
        0, 4,
        100000, 5,
        500000, 10,
        1000000, 15,
        2000000, 20,
        5000000, 25
      ],
      'circle-color': '#39FF14',  
      'circle-blur': 0.5,
      'circle-opacity': 0.8,
      'circle-stroke-width': .5,
      'circle-stroke-color': 'yellow'
    },
    'layout': {
      'visibility': 'visible'
    }
  });  
  
// Add a source for the rivers feature class.
map.addSource('rivers', {
    type: 'geojson',
    data: 'data/Rivers.geojson' 
  });
  
  map.addLayer({
    'id': 'Major Rivers',
    'type': 'line',
    'source': 'rivers',
    'layout': {
      'visibility': 'visible'
    },
    'paint': {
      'line-width': [
        'case',
        ['>', ['get', 'miles'], 500], 2, // rivers longer than 500 miles get a width of 2
        ['>', ['get', 'miles'], 750], 3, // rivers longer than 750 miles get a width of 3
        ['>', ['get', 'miles'], 1000], 4, // rivers longer than 1000 miles get a width of 4
        ['>', ['get', 'miles'], 1500], 5, // rivers longer than 1500 miles get a width of 5
        1 // default width for shorter rivers
      ],
      'line-color': '#2F80ED', // water blue color
      'line-opacity': 0.8
    }
  });
    // Adding a control to let the user adjust their view
    const navControl = new mapboxgl.NavigationControl({
        visualizePitch: true
    });
    map.addControl(navControl, 'top-right');
    // Adding Geo Location
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    }));
    // Adding Scale Control
    const scale = new mapboxgl.ScaleControl({
        maxWidth: 150,
        unit: 'miles'
    });
    map.addControl(scale);
    scale.setUnit('imperial');
    // Adding Attribution Control
    map.addControl(new mapboxgl.AttributionControl
        ({customAttribution: 'Map design by Joshua Serfass, Data Retrieved From: https://public-nps.opendata.arcgis.com/, Background Photo: Joshua Serfass',
          compact: true,
        }))
    });

// When a click event occurs on a feature in the trails layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on('click', 'Major Rivers', (e) => {
    const length = e.features[0].properties.MILES.toFixed(1);
    let description = "<b>River Name: </b>" + e.features[0].properties.NAME + "<br>";
    if (length > 2414.06 * 0.621371) {
        description += "<b>River Length (Miles): </b>" + length + "<br>";
        description += "<b>Category: </b>Great River<br>";
    } else if (length > 1609.34 * 0.621371) {
        description += "<b>River Length (Miles): </b>" + length + "<br>";
        description += "<b>Category: </b>Major River<br>";
    } else if (length > 1207.01 * 0.621371) {
        description += "<b>River Length (Miles): </b>" + length + "<br>";
        description += "<b>Category: </b>Medium River<br>";
    } else if (length > 804.672 * 0.621371) {
        description += "<b>River Length (Miles): </b>" + length + "<br>";
        description += "<b>Category: </b>Small River<br>";
    } else {
        description += "<b>River Length (Miles): </b>" + length + "<br>";
        description += "<b>Category: </b>Tiny River<br>";
    }
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(description)
        .addTo(map);
});
    // Change the cursor to a pointer when the mouse is over the trails layer.
    map.on('mouseenter', 'Major Rivers', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'Major Rivers', () => {
    map.getCanvas().style.cursor = '';
    });

// When a click event occurs on a feature in the Peaks layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on('click', 'WA Peaks', (e) => {
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML("<b>Peak Name: </b>" + e.features[0].properties.NAME + "<br><b>Summit Elevation (Feet): </b>" + e.features[0].properties.ELEV_FEET + 
    "<br><b>Prominence: </b>" + e.features[0].properties.PROMINENCE + "<br><b>County: </b>" + e.features[0].properties.COUNTY)
    .addTo(map);
    });
     
    // Change the cursor to a pointer when the mouse is over the trails layer.
    map.on('mouseenter', 'WA Peaks', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'WA Peaks', () => {
    map.getCanvas().style.cursor = '';
    });

// When a click event occurs on a feature in the NPS Boundary layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on('click', 'NPS Boundary', (e) => {
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML("<b>Park Name: </b>" + e.features[0].properties.UNIT_NAME)
    .addTo(map);
    });
     
    // Change the cursor to a pointer when the mouse is over the trails layer.
    map.on('mouseenter', 'NPS Boundary', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'NPS Boundary', () => {
    map.getCanvas().style.cursor = '';
    });

// When a click event occurs on a feature in the USFS Boundary layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on('click', 'USFS Boundary', (e) => {
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML("<b>Forest Name: </b>" + e.features[0].properties.FORESTNAME)
    .addTo(map);
    });
     
    // Change the cursor to a pointer when the mouse is over the trails layer.
    map.on('mouseenter', 'USFS Boundary', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'USFS Boundary', () => {
    map.getCanvas().style.cursor = '';
    });

// add terrain layer
map.on('load', function () {
    map.addSource('mapbox-dem', {
        "type": "raster-dem",
        "url": "mapbox://mapbox.mapbox-terrain-dem-v1",
        'tileSize': 512,
        'maxzoom': 15,
    });
     map.setTerrain({"source": "mapbox-dem", "exaggeration": 1.5})
     map.setFog({
        'range': [-1, 2],
        'horizon-blend': 0.6,
        'color': 'white',
        'high-color': '#add8e6',
        'space-color': '#d8f2ff',
        'star-intensity': 0.0,
        'opacity':0.5
    });
    });
// After the last frame rendered before the map enters an "idle" state.
map.on('idle', () => {    
    // If these two layers were not added to the map, abort
    if (!map.getLayer('Summit Routes') || !map.getLayer('WA State Boundary')|| !map.getLayer('NPS Boundary')|| !map.getLayer('USFS Boundary')) {
    return;
    }


    // Enumerate ids of the layers.
    const toggleableLayerIds = ['Summit Routes', 'WA State Boundary', 'NPS Boundary', 'USFS Boundary'];
 
    // Set up the corresponding toggle button for each layer.
    for (const id of toggleableLayerIds) {
        // Skip layers that already have a button set up.
        if (document.getElementById(id)) {
            continue;
        }
    
        // Create a link.
        const link = document.createElement('a');
        link.id = id;
        link.href = '#';
        link.textContent = id;
        link.className = 'active';
        
        // Show or hide layer when the toggle is clicked.
        link.onclick = function (e) {
            const clickedLayer = this.textContent;
            e.preventDefault();
            e.stopPropagation();
        
            const visibility = map.getLayoutProperty(
                clickedLayer,
                'visibility'
        );
        
        // Toggle layer visibility by changing the layout object's visibility property.
        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(
                clickedLayer,
                'visibility',
                'visible'
            );
        }
        };    
        
            const layers = document.getElementById('menu');
            layers.appendChild(link);
        }
});        


