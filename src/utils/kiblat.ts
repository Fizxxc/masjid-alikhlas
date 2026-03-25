const KAABA = { lat: 21.4225, lng: 39.8262 };

function toRad(v: number) { return v * Math.PI / 180; }
function toDeg(v: number) { return v * 180 / Math.PI; }

export function getQiblaBearing(lat: number, lng: number) {
  const phiK = toRad(KAABA.lat);
  const lambdaK = toRad(KAABA.lng);
  const phi = toRad(lat);
  const lambda = toRad(lng);
  const y = Math.sin(lambdaK - lambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}
