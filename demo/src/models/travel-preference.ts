export interface TravelPreference {
  uri?: string;
  modeOfTransportation: string;
}

export const parseTravelPreference = (uri: string, data: string): TravelPreference => {

  const content = JSON.parse(data) as object;

  if(
    !('modeOfTransportation' in content)
  ) {

    throw new Error('Data is missing arguments');

  }

  const { modeOfTransportation } = content;

  if(
    typeof modeOfTransportation !== 'string'
  ) {

    throw new Error('Data is missing arguments');

  }

  return {
    uri,
    modeOfTransportation,
  };

};
