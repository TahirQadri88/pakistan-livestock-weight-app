export const MEASUREMENT_LIMITS = Object.freeze({girth:{min:40,max:300},length:{min:30,max:300}});

// Exact density divisors from the original application source.
export const DENSITY_PROFILES = Object.freeze({
  cattle:{sahiwal:10840,general:10840},
  buffalo:{'nili-ravi':10400,general:10480},
  sheep:{'lohi-kajli':10840,dumba:10600,general:10840},
  goat:{teddy:10500,'beetal-rajanpuri':10840,general:10840}
});

export function estimateWeight(animal,breed,girthCm,lengthCm){
  const d=DENSITY_PROFILES?.[animal]?.[breed];
  if(!d) throw new Error('Unknown density profile');
  return (Number(lengthCm)*Number(girthCm)**2)/d;
}

export function validateMeasurements(values){
  const errors={};
  for(const key of ['girth','length']){
    const v=Number(values[key]),lim=MEASUREMENT_LIMITS[key];
    if(!String(values[key]??'').trim()) errors[key]='required';
    else if(!Number.isFinite(v)||v<=0) errors[key]='invalid';
    else if(v<lim.min||v>lim.max) errors[key]='range';
  }
  return errors;
}
