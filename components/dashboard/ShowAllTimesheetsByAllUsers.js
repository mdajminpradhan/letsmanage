import { Fragment, useEffect, useState } from 'react';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useAppStore from '@/appStore';
import { Transition, Listbox } from '@headlessui/react';
import { CalendarDaysIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { format } from 'date-fns';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
var convert = require('convert-seconds');

const ShowAllTimesheetsByAllUsers = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // app global store
  const { users, userData } = useAppStore((state) => ({
    users: state.users,
    userData: state.userData
  }));

  // getting all timesheets
  useEffect(() => {
    if (Object.keys(users).length > 0 && Object.keys(userData).length > 0 && selectedEmployee === '') {
      // query data
      const q = query(collection(getFirestore(), 'timesheets'), where('date', '==', format(selectedDate, 'dd-MM-yyyy')));

      // getting data
      onSnapshot(q, (querySnapshot) => {
        const records = [];
        querySnapshot.forEach(async (doc) => {
          const record = doc.data();
          record.id = doc.id;
          records.push(record);
        });
        setTimesheets(records);
        setIsLoading(false);
      });
    }
  }, [users, userData, selectedDate]);

  // getting all timesheets
  useEffect(() => {
    // when status changes
    if (!!selectedEmployee) {
      // query
      const q = query(
        collection(getFirestore(), `timesheets`),
        where('employee.id', '==', selectedEmployee.id),
        where('date', '==', format(selectedDate, 'dd-MM-yyyy'))
      );

      // getting data
      onSnapshot(q, (querySnapshot) => {
        const records = [];

        querySnapshot.forEach((doc) => {
          const record = doc.data();
          record.id = doc.id;
          records.push(record);
        });

        setTimesheets(records);
        setIsLoading(false);
      });
    }
  }, [selectedEmployee, selectedDate]);

  console.log('user - ', format(selectedDate, 'dd-MM-yyyy'));

  return (
    <>
      <div className="flex justify-between items-center w-11/12 mx-auto mt-10 mb-6">
        <p className="text-lg">All Timesheets</p>

        <div className="flex items-center">
          <div className="flex items-center mt-[3px] border border-white border-opacity-10 py-1.5 rounded-full pt-3">
            <CalendarDaysIcon className="h-5 w-5 text-white ml-5 relative -top-1" title="Start date" />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="bg-transparent relative -top-[2px] cursor-pointer focus:ring-0 outline-none ml-2 text-sm"
              title="Timesheet date"
              dateFormat="dd-MM-yyyy"
              placeholderText="Timesheet date"
            />
          </div>

          <Listbox value={selectedEmployee} onChange={setSelectedEmployee}>
            <div className="relative ml-8">
              <Listbox.Button className="relative w-full cursor-pointer rounded-full border border-white border-opacity-10 text-sm px-4 py-2.5 pr-14 focus:outline-none focus:ring-0">
                <span className="block truncate">{!!selectedEmployee ? selectedEmployee.name : 'All Users'}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute right-0 mt-1 max-h-60 w-48 overflow-y-scroll rounded-md bg-gray-900 py-1 shadow-lg ring-0 focus:outline-none sm:text-sm">
                  <Listbox.Option
                    className={({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-gray-900' : ''}`}
                    value={''}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>All Users</span>
                        {selected ? (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-amber-600">
                            <CheckIcon className="h-4 w-4" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                  {users?.map((user, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-gray-900' : ''}`}
                      value={user}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{user.name}</span>
                          {selected ? (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-amber-600">
                              <CheckIcon className="h-4 w-4" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

      <div className={`w-11/12 px-8 mx-auto overflow-x-scroll scrollbar-thin`}>
        <div className="grid grid-cols-12 w-[650px] lg:w-[850px] xl:w-[1000px] 2xl:w-[1500px]">
          <p className="col-span-4 text-sm font-medium">Employee</p>
          <p className="col-span-3 text-center text-sm font-medium">Tracked</p>
          <p className="col-span-3 text-center text-sm font-medium">Department</p>
          <p className="col-span-2 text-center text-sm font-medium">Status</p>
        </div>

        <div className="w-[650px] lg:w-[850px] xl:w-[1000px] 2xl:w-[1500px] bg-amrblue bg-opacity-10 mt-3 rounded-sm h-[550px] scrollbar-thin">
          {isLoading === true ? (
            <Skeleton count={10} baseColor="#09387a" />
          ) : timesheets?.length > 0 ? (
            timesheets.map((timesheet, index) => (
              <Link href={`/timesheets/${timesheet.id}`} key={index}>
                <div
                  className="grid grid-cols-12 items-center border-b border-white border-opacity-25 pl-8 pr-2 hover:bg-amrblue hover:bg-opacity-10 cursor-pointer"
                  key={index}
                >
                  <p className="col-span-4 border-r border-white border-opacity-25 h-full py-2 text-sm">{timesheet?.employee?.name || 'Employee'}</p>
                  <p className="col-span-3 grid place-content-center border-r border-white border-opacity-25 h-full py-2 text-sm">
                    {`${convert(timesheet?.totalTime).hours}hr ${convert(timesheet?.totalTime).minutes}m ${convert(timesheet?.totalTime).seconds}s`}
                  </p>
                  <p className="col-span-3 grid place-content-center border-r border-white border-opacity-25 h-full py-2 text-sm">
                    {timesheet?.employee?.departmentName || 'Department'}
                  </p>
                  <p className="col-span-2 grid place-content-center py-2 text-sm capitalize">{timesheet?.status || 'Status'}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="p-44 w-full mx-auto text-center text-lg">No timesheet found...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ShowAllTimesheetsByAllUsers;
