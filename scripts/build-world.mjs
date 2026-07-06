/**
 * build-world.mjs — generates src/lib/world.json from Natural Earth data.
 *
 * Decodes world-atlas TopoJSON (land-110m + countries-110m) into:
 *   · coasts  — unique coastline polylines (bright strokes)
 *   · borders — unique country-boundary polylines (faint strokes)
 *   · dots    — landmass fill: an even spherical grid PIP-tested against land
 * Coordinates are stored as integers ×100 to keep the file small.
 *
 * Run: node scripts/build-world.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'src', 'lib', 'world.json');

const LAND_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json';
const COUNTRIES_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/* ── TopoJSON arc decoding ───────────────────────────────────────────── */
function decodeArcs(topo) {
  const [sx, sy] = topo.transform.scale;
  const [tx, ty] = topo.transform.translate;
  return topo.arcs.map(arc => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => {
      x += dx; y += dy;
      return [x * sx + tx, y * sy + ty];
    });
  });
}

/* Assemble a ring's coordinates from arc indices (for PIP only) */
function ringFromArcs(arcIdxs, decoded) {
  const pts = [];
  for (const ai of arcIdxs) {
    const arc = ai < 0 ? decoded[~ai].slice().reverse() : decoded[ai];
    for (let i = pts.length ? 1 : 0; i < arc.length; i++) pts.push(arc[i]);
  }
  return pts;
}

function inRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

const land = await (await fetch(LAND_URL)).json();
const countries = await (await fetch(COUNTRIES_URL)).json();

const landArcs = decodeArcs(land);
const countryArcs = decodeArcs(countries);

/* Land rings (with bounding boxes) for point-in-polygon */
const rings = [];
for (const geom of land.objects.land.geometries) {
  const polys = geom.type === 'Polygon' ? [geom.arcs] : geom.arcs;
  for (const poly of polys) {
    for (const ringArcs of poly) {
      const ring = ringFromArcs(ringArcs, landArcs);
      let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;
      for (const [lon, lat] of ring) {
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
      rings.push({ ring, minLon, maxLon, minLat, maxLat });
    }
  }
}

function isLand(lon, lat) {
  let inside = false;
  for (const r of rings) {
    if (lon < r.minLon || lon > r.maxLon || lat < r.minLat || lat > r.maxLat) continue;
    if (inRing(lon, lat, r.ring)) inside = !inside; // even-odd across holes
  }
  return inside;
}

/* Landmass dot grid — even on the sphere, jittered for organic texture */
const STEP = 1.5;
const dots = [];
for (let lat = -85; lat <= 85; lat += STEP) {
  const lonStep = STEP / Math.max(0.18, Math.cos((lat * Math.PI) / 180));
  for (let lon = -180; lon < 180; lon += lonStep) {
    const jLon = lon + (Math.random() - 0.5) * lonStep * 0.55;
    const jLat = lat + (Math.random() - 0.5) * STEP * 0.55;
    if (isLand(jLon, jLat)) {
      dots.push(Math.round(jLon * 100), Math.round(jLat * 100));
    }
  }
}

const enc = arcs => arcs
  .filter(a => a.length > 1)
  .map(a => a.flatMap(([lon, lat]) => [Math.round(lon * 100), Math.round(lat * 100)]));

const world = {
  s: 100,
  coasts: enc(landArcs),
  borders: enc(countryArcs),
  dots,
};

writeFileSync(OUT, JSON.stringify(world));
console.log(
  `world.json written — coasts: ${world.coasts.length} arcs, borders: ${world.borders.length} arcs, dots: ${dots.length / 2}`,
);
