export interface TravelPreference {
  uri?: string;
  modeOfTransportation: string;
  daysOfWeek: number[];
}

export const parseTravelPreference = (uri: string, data: string): TravelPreference => {

  const content = JSON.parse(data) as object;

  if(
    !('modeOfTransportation' in content) ||
    !('daysOfWeek' in content)
  ) {

    throw new Error('Data is missing arguments');

  }

  const { daysOfWeek, modeOfTransportation } = content;

  if(
    typeof modeOfTransportation !== 'string' ||
    !Array.isArray(daysOfWeek)
  ) {

    throw new Error('Data is missing arguments');

  }

  return {
    uri,
    modeOfTransportation,
    daysOfWeek,
  };

};
