import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

const DateTimePicker = (props) => {
    const { selectedDate, setSelectedDate, selectedTime, setSelectedTime } = props;

  const times = [
    '00:00', '00:30', '01:00', '01:30',
    '02:00', '02:30', '03:00', '03:30',
    '04:00', '04:30', '05:00', '05:30',
    '06:00', '06:30', '07:00', '07:30',
    '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30',
    '22:00', '22:30', '23:00', '23:30',
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  return (
    <div className="pt-5 border-t border-gray-200 dark:border-gray-800 flex sm:flex-row flex-col sm:space-x-5 rtl:space-x-reverse">
      <div className="mx-auto sm:mx-0">
        {/* Replace with a date picker component */}
        <input
          type="date"
          value={selectedDate.toISOString().substring(0, 10)}
          onChange={(e) => handleDateChange(new Date(e.target.value))}
          className="mx-auto sm:mx-0"
        />
      </div>
      <div className="sm:ms-7 sm:ps-5 sm:border-s border-gray-200 dark:border-gray-800 w-full sm:max-w-[15rem] mt-5 sm:mt-0">
        <h3 className="text-gray-900 dark:text-white text-base font-medium mb-3 text-center">
          {selectedDate.toDateString()}
        </h3>
        <button
          type="button"
          data-collapse-toggle="timetable"
          className="inline-flex items-center w-[47.8em] py-2 px-5 me-2 justify-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          <svg
            className="w-4 h-4 text-gray-800 dark:text-white me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
              clipRule="evenodd"
            />
          </svg>
          Pick a time
        </button>
        <label className="sr-only">Pick a time</label>
        <ul id="timetable" className="grid w-[42em] grid-cols-4 gap-2 mt-5">
          {times.map((time) => (
            <li key={time}>
              <input
                type="radio"
                id={time.replace(':', '-').toLowerCase()}
                value={time}
                className="hidden peer"
                name="timetable"
                checked={selectedTime === time}
                onChange={() => handleTimeChange(time)}
              />
              <label
                htmlFor={time.replace(':', '-').toLowerCase()}
                className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-white border rounded-lg cursor-pointer text-blue-600 border-blue-600 dark:hover:text-white dark:border-blue-500 dark:peer-checked:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-600 hover:text-white peer-checked:text-white hover:bg-blue-500 dark:text-blue-500 dark:bg-gray-900 dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:peer-checked:bg-blue-500"
              >
                {time}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DateTimePicker;
