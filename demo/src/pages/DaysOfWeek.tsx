import { useEffect, useState } from 'react';
import { DayOfWeek, daysOfWeek } from '../models/days-of-week';

const DaysOfWeek = (i: {
  disabled: boolean;
  selection: DayOfWeek[];
  multiple: boolean;
  onSelectionChanged?: (selection: DayOfWeek[]) => void;
}) => {

  const [ selectedDaysOfWeek, setSelectedDaysOfWeek ] = useState<DayOfWeek[]>([]);

  useEffect(() => {

    setSelectedDaysOfWeek(i.selection);

  }, [ i.selection ]);

  const onClickDayOfWeek = (index: DayOfWeek) => {

    if(!i.disabled){

      let newSelection = [ index ];

      if(i.multiple){

        newSelection = [
          ...selectedDaysOfWeek.includes(index) ? [] : [ index ],
          ...selectedDaysOfWeek.filter((dayOfWeekIndex) => dayOfWeekIndex !== index),
        ];

      }

      setSelectedDaysOfWeek(
        newSelection
      );

      if(i.onSelectionChanged) {

        i.onSelectionChanged(newSelection);

      }

    }

  };

  return (
    <>
      <div className="flex flex-row gap-4">
        {
          // Show the days of the week.
          daysOfWeek.map(
            (day, index) =>
              <div
                key={index}
                className={`rounded-md cursor-pointer border border-emerald-500 px-3 py-2 ${selectedDaysOfWeek.includes(day) ? 'bg-emerald-500' : 'bg-slate-100'}`}
                onClick={() => onClickDayOfWeek(day)}>
                {day}</div>
          )
        }
      </div>
    </>
  );

};

export default DaysOfWeek;
