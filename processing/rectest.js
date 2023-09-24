function validateJson(jsonObj) {
  let isValid = true;
  let errors = [];

  // Define the keys that need to be checked
  const keysToCheck = [
    'danceability',
    'energy',
    'key',
    'loudness',
    'mode',
    'speechiness',
    'acousticness',
    'instrumentalness',
    'liveness',
    'valence',
    'tempo',
  ];

  // Define allowed ranges for each key
  const allowedRanges = {
    'danceability': [0.0, 1.0],
    'energy': [0.0, 1.0],
    'key': [0, 11],
    'loudness': [-60.0, 0.0],
    'mode': [0, 1],
    'speechiness': [0.0, 1.0],
    'acousticness': [0.0, 1.0],
    'instrumentalness': [0.0, 1.0],
    'liveness': [0.0, 1.0],
    'valence': [0.0, 1.0],
    'tempo': [0.0, 300.0]
  };

  keysToCheck.forEach((key) => {
    // Extract target, min, and max values for each key
    const target = jsonObj[`target_${key}`];
    const min = jsonObj[`min_${key}`];
    const max = jsonObj[`max_${key}`];

    // Check if target, min, and max are within allowed ranges
    if (target < allowedRanges[key][0] || target > allowedRanges[key][1]) {
      isValid = false;
      errors.push(`Target ${key} is out of allowed range.`);
    }
    if (min < allowedRanges[key][0] || min > allowedRanges[key][1]) {
      isValid = false;
      errors.push(`Min ${key} is out of allowed range.`);
    }
    if (max < allowedRanges[key][0] || max > allowedRanges[key][1]) {
      isValid = false;
      errors.push(`Max ${key} is out of allowed range.`);
    }

    // Check if target is between min and max
    if (target < min || target > max) {
      isValid = false;
      errors.push(`Target ${key} is out of range.`);
    }

    // Check if min is less than or equal to max
    if (min > max) {
      isValid = false;
      errors.push(`Min ${key} is greater than Max ${key}.`);
    }
  });

  return { isValid, errors };
}

let a =  {
  "limit": 20,
  "market": "US",
  "seed_artists": "4NHQUGzhtTLFvgF5SZesLK",
  "target_danceability": 0.6688500000000001,
  "min_danceability": 0.166,
  "max_danceability": 0.887,
  "target_energy": 0.6879166666666665,
  "min_energy": 0.212,
  "max_energy": 0.964,
  "target_key": 5.3,
  "min_key": 0,
  "max_key": 11,
  "target_loudness": -7.021816666666669,
  "min_loudness": -16.765,
  "max_loudness": -2.758,
  "target_mode": 0.5666666666666667,
  "min_mode": 0,
  "max_mode": 1,
  "target_speechiness": 0.07494833333333334,
  "min_speechiness": 0.0261,
  "max_speechiness": 0.32,
  "target_acousticness": 0.22657969999999994,
  "min_acousticness": 0.000313,
  "max_acousticness": 0.962,
  "target_instrumentalness": 0.06920713833333332,
  "min_instrumentalness": 0,
  "max_instrumentalness": 0.904,
  "target_liveness": 0.1943716666666667,
  "min_liveness": 0.0293,
  "max_liveness": 0.575,
  "target_valence": 0.6098333333333331,
  "min_valence": 0.124,
  "max_valence": 0.962,
  "target_tempo": 127.6196,
  "min_tempo": 76.584,
  "max_tempo": 191.385
}

console.log(validateJson(a));
