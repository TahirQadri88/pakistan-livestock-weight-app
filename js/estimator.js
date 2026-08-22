export const MEASUREMENT_LIMITS = Object.freeze({girth:{min:40,max:300},length:{min:30,max:300}});
export const DENSITY_PROFILES = Object.freeze({
  cattle:{general:10840,sahiwal:10840,cholistani:10840,'red-sindhi':10840,crossbred:10840},
  buffalo:{'nili-ravi':10400,general:10840},
  sheep:{kajli:10840,lohi:10840,thalli:10840,general:10840},
  goat:{beetal:10840,kamori:10840,teddy:10840,general:10840}
});
export function estimateWeight(animal,breed,girthCm,lengthCm){const d=DENSITY_PROFILES?.[animal]?.[breed];if(!d)throw new Error('Unknown density profile');return (Number(girthCm)**2*Number(lengthCm))/d;}
export function validateMeasurements(values){const errors={};for(const key of ['girth','length']){const v=Number(values[key]),lim=MEASUREMENT_LIMITS[key];if(!String(values[key]??'').trim())errors[key]='required';else if(!Number.isFinite(v)||v<=0)errors[key]='invalid';else if(v<lim.min||v>lim.max)errors[key]='range';}return errors;}
