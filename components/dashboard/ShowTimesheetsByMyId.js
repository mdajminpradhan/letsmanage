import { useEffect, useState } from 'react';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { Menu } from '@headlessui/react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Link from 'next/link';
import useAppStore from '@/appStore';
import { CalendarDaysIcon } from '@heroicons/react/20/solid';
import { format } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import MenuTransition from 'components/common/MenuTransition';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
var convert = require('convert-seconds');

const ShowTasksByMyId = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  // app global store
  const { userData } = useAppStore((state) => ({
    userData: state.userData
  }));

  // getting all tasks
  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      // query
      const q = query(
        collection(getFirestore(), `timesheets`),
        where('employee.id', '==', userData.id),
        where('date', '>=', format(selectedDate.startDate, 'dd-MM-yyyy')),
        where('date', '<=', format(selectedDate.endDate, 'dd-MM-yyyy'))
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
  }, [userData, selectedDate]);

  return (
    <>
      <div className="flex justify-between items-center w-11/12 mx-auto mt-10 mb-6">
        <p className="md:text-lg">All Timesheets</p>

        <div className="flex items-center border border-white border-opacity-10 rounded-full">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="px-2 sm:px-4 py-2 md:px-3 text-xs md:text-sm focus:outline-none ring-0 relative flex items-center">
                <CalendarDaysIcon className="hidden sm:block h-5 w-5 text-white relative" title="Start date" />
                <span className='pl-2 pt-[2px]'>
                  {format(selectedDate.startDate, 'dd-MM-yyyy')} - {format(selectedDate.endDate, 'dd-MM-yyyy')}
                </span>
              </Menu.Button>
            </div>
            <MenuTransition>
              <Menu.Items className="absolute -right-6 sm:right-0 mt-2 w-auto origin-top-right divide-y ring-0focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    <DateRangePicker ranges={[selectedDate]} onChange={(e) => setSelectedDate(e.selection)} />
                  </Menu.Item>
                </div>
              </Menu.Items>
            </MenuTransition>
          </Menu>
        </div>
      </div>

      <div className={`w-11/12 px-8 mx-auto overflow-x-scroll`}>
        <div className="grid grid-cols-12 w-[850px] lg:w-[1050px] xl:w-[1300px] 2xl:w-[1500px]">
          <p className="col-span-4 text-sm font-medium">Employee</p>
          <p className="col-span-3 text-center text-sm font-medium">Tracked</p>
          <p className="col-span-3 text-center text-sm font-medium">Department</p>
          <p className="col-span-2 text-center text-sm font-medium">Status</p>
        </div>

        <div className="w-[850px] lg:w-[1050px] xl:w-[1300px] 2xl:w-[1500px] bg-amrblue bg-opacity-10 mt-3 rounded-sm h-[550px] scrollbar-thin">
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

export default ShowTasksByMyId;
