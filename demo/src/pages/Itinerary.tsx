import { useCallback, useEffect, useState } from 'react';
import { log } from '@useid/movejs';
import { TravelPreference } from '../models/travel-preference';
import { City, TravelRoute, cities, travelRoutes } from '../models/travel-route';
import { TravelDisruption } from '../models/travel-disruption';
import { DayOfWeek, daysOfWeek } from '../models/days-of-week';

const Itinerary = (i: {
  travelPreferences: TravelPreference[];
  travelDisruptions: TravelDisruption[];
}) => {

  /**
   * The city from which the commuter wants to travel.
   */
  const [ from, setFrom ] = useState<City>('Antwerp');
  /**
   * The city to which the commuter wants to travel.
   */
  const [ to, setTo ] = useState<City>('Brussels');
  /**
   * The day of the week on which the user wants to travel.
   */
  const [ selectedDayOfWeek, setSelectedDayOfWeek ] = useState<DayOfWeek>(daysOfWeek[(new Date()).getDay() - 1]);
  /**
   * The available travel routes.
   */
  const [ proposedTravelRoutes, setProposedTravelRoutes ] = useState<TravelRoute[]>([]);

  /**
   * Generates a personalised itinerary based on the user's preferences and disruptions.
   */
  const onGenerateItinerary = useCallback(() => {

    log('Handling generating itinerary', { from, to, selectedDayOfWeek });

    // Get all travel modes based on the commuter's preferences and the selected day
    const selectedTravelModes = i.travelPreferences
      .filter((preference) => preference.daysOfWeek.includes(selectedDayOfWeek))
      .map((preference) => preference.travelMode);

    // Filter routes based on the selected day, mode and exclude the ones with travel disruptions
    setProposedTravelRoutes(
      travelRoutes.filter((route) =>
        selectedTravelModes.includes(route.travelMode) &&
        route.from === from &&
        route.to === to &&
        i.travelDisruptions.filter(
          (d) =>
            d.daysOfWeek.includes(selectedDayOfWeek) &&
            d.from === route.from &&
            d.to === route.to &&
            d.travelMode === route.travelMode
        ).length === 0)
    );

  }, [ from, i.travelDisruptions, i.travelPreferences, selectedDayOfWeek, to ]);

  useEffect(() => {

    onGenerateItinerary();

  }, [ onGenerateItinerary ]);

  return (
    <>
      <div className="w-full h-full flex flex-col rounded-lg bg-white">
        <h2 className="text-3xl p-4 border-b-2 border-slate-50 h-20">Where would you like to go?</h2>
        <div className="flex flex-col content-between gap-8 text-sm p-4">
          <div className="flex flex-row gap-4">
            <div className="flex flex-row gap-4 items-center">
              <label htmlFor="from">From</label>

              <select className="appearance-none border-b border-b-emerald-500 text-emerald-500 border-dashed rounded-none px-3 py-2" name="from" id="from" data-testid="select" value={from} onChange={(event) => { setFrom(event.target.value); onGenerateItinerary(); }}>
                {cities.map((city, index) => <option key={index} value={city}>{city}</option>)}
              </select>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label htmlFor="to">to</label>

              <select className="appearance-none border-b border-b-emerald-500 text-emerald-500 border-dashed rounded-none px-3 py-2" name="to" id="to" value={to} onChange={(event) => { setTo(event.target.value); onGenerateItinerary(); }}>
                {cities.map((city, index) => <option key={index} value={city}>{city}</option>)}
              </select>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label htmlFor="on">on</label>

              <select className="appearance-none border-b border-b-emerald-500 text-emerald-500 border-dashed rounded-none px-3 py-2" name="on" id="on" value={selectedDayOfWeek} onChange={(event) => { setSelectedDayOfWeek(event.target.value); onGenerateItinerary(); }}>
                {daysOfWeek.map((day, index) => <option key={index} value={day}>{day}</option>)}
              </select>
            </div>
          </div>
          {
            // Show list of travel disruptions
            i.travelDisruptions.filter(
              (d) =>
                d.daysOfWeek.includes(selectedDayOfWeek) &&
                      d.from === from &&
                      d.to === to
            ).map((d) =>
              <div className="w-full bg-orange-600 p-2">{d.label}</div>)
          }
          {
            // Show list of travel routes, if any
            proposedTravelRoutes.length === 0 ?
              <p>No travel routes found</p> :
              <div className="flex flex-col gap-2">
                {
                  proposedTravelRoutes.map(
                    (route, index) =>
                      <div key={index} className="bg-slate-100 p-2 flex flex-row gap-4">
                        <div>{index + 1}</div>
                        <div className="flex flex-col">
                          <div className="font-semibold">{route.label}</div>
                          <div>{route.travelMode}</div>
                        </div>
                      </div>
                  )
                }
              </div>
          }
        </div>
      </div>
    </>
  );

};

export default Itinerary;
