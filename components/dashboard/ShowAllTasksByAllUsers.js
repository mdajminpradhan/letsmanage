import useAppStore from '@/appStore';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { FlagIcon } from '@heroicons/react/24/solid';
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import { collection, doc, getFirestore, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { toast } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
var convert = require('convert-seconds');

// task status
const statuses = ['To Do', 'In Progress', 'Complete', 'Closed'];

const ShowAllTasksByAllUsers = () => {
  const [tasks, setTasks] = useState([]);
  const [finalTasks, setFinalTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateRange, setDateRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: 'selection'
    }
  ]);

  // router
  const { query: routerQuery, asPath } = useRouter();

  // app global store
  const { users } = useAppStore((state) => ({
    users: state.users
  }));

  // getting all tasks
  useEffect(() => {
    if (Object.keys(routerQuery).length > 0) {
      // query data
      const q = query(collection(getFirestore(), `spaces/${routerQuery.spaceId}/tasks`), where('status', '==', selectedStatus));

      // getting data
      onSnapshot(q, (querySnapshot) => {
        const records = [];
        querySnapshot.forEach(async (doc) => {
          const record = doc.data();
          record.id = doc.id;
          records.push(record);
        });
        setTasks(records);
        setIsLoading(false);
      });
    }
  }, [routerQuery]);

  // getting all tasks
  useEffect(() => {
    const setTasksFunction = (q) => {
      onSnapshot(q, (querySnapshot) => {
        const records = [];
        querySnapshot.forEach((doc) => {
          const record = doc.data();
          record.id = doc.id;
          records.push(record);
        });
        setTasks(records);
        setIsLoading(false);
      });
    };

    if (selectedStatus !== '' && selectedEmployee !== '') {
      // query
      const q = query(
        collection(getFirestore(), `spaces/${routerQuery.spaceId}/tasks`),
        where('selectedEmployeeId', '==', selectedEmployee?.id),
        where('status', '==', selectedStatus)
      );
      // getting data
      setTasksFunction(q);
    } else if (selectedStatus !== '' && selectedEmployee === '') {
      // query
      const q = query(collection(getFirestore(), `spaces/${routerQuery.spaceId}/tasks`), where('status', '==', selectedStatus));
      // getting data
      setTasksFunction(q);
    } else if (selectedStatus === '' && selectedEmployee !== '') {
      // query
      const q = query(collection(getFirestore(), `spaces/${routerQuery.spaceId}/tasks`), where('selectedEmployeeId', '==', selectedEmployee?.id));
      // getting data
      setTasksFunction(q);
    } else if (selectedStatus === '' && selectedEmployee === '') {
      // query
      const q = query(collection(getFirestore(), `spaces/${routerQuery.spaceId}/tasks`));
      // getting data
      setTasksFunction(q);
    }
  }, [selectedStatus, selectedEmployee, asPath]);

  // update status
  const handleUpdate = async (whatToUpdate, task) => {
    try {
      const docRef = doc(getFirestore(), `tasks/${routerQuery.spaceId}/tasks`, task.id);
      await updateDoc(docRef, whatToUpdate);

      // setSelectedRole(role);
      toast.success('Record has been updated...');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const { startDate, endDate } = dateRange[0];
    const selectedDate = eachDayOfInterval({ start: startDate, end: endDate });

    let allTask = [];
    const unscheduled = tasks.filter((task) => task.taskDate === '');
    allTask.push(...unscheduled);

    selectedDate.map((day) => {
      const todayTask = tasks.filter((task) => task.taskDate === format(day, 'dd/MM/yyyy'));
      allTask.push(...todayTask);
    });

    allTask.length === 0 ? setFinalTasks(tasks) : setFinalTasks(allTask);
    allTask = [];
  }, [dateRange, tasks]);

  return (
    <>
      <div className="flex justify-between items-center w-11/12 mx-auto mt-10 mb-6">
        <p className="text-lg">All Tasks</p>

        <div className="flex items-center">
          <Listbox>
            <div className="relative ml-2">
              <Listbox.Button className="relative w-full cursor-pointer rounded-full border border-white border-opacity-10 text-sm px-4 py-2.5 pr-14 focus:outline-none focus:ring-0">
                <span className="block truncate">Filter By Date</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute z-50 rounded-md right-0 mt-1 bg-gray-900 py-1 shadow-lg ring-0 focus:outline-none sm:text-sm">
                  <DateRangePicker
                    onChange={(item) => setDateRange([item.selection])}
                    ranges={dateRange}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={1}
                    direction="horizontal"
                  />
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>

          <Listbox value={selectedStatus} onChange={setSelectedStatus}>
            <div className="relative ml-2">
              <Listbox.Button className="relative w-full cursor-pointer rounded-full border border-white border-opacity-10 text-sm px-4 py-2.5 pr-14 focus:outline-none focus:ring-0">
                <span className="block truncate">{!!selectedStatus ? selectedStatus : 'Status'}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute right-0 mt-1 max-h-60 w-48 overflow-y-scroll rounded-md bg-gray-900 py-1 shadow-lg ring-0 focus:outline-none sm:text-sm">
                  {statuses?.map((status, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-gray-900' : ''}`}
                      value={status}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{status}</span>
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

      <div className={`w-11/12 px-8 mx-auto overflow-x-scroll`}>
        <div className="grid grid-cols-12 w-[850px] lg:w-[1150px] xl:w-[1250px] 2xl:w-[1500px]">
          <p className="col-span-4 font-medium">Title</p>
          <p className="col-span-3 text-center font-medium">Status</p>
          <p className="col-span-1 text-center font-medium">Priority</p>
          <p className="col-span-1 text-center font-medium">Tracked</p>
          <p className="col-span-2 text-center font-medium">Deadline</p>
          <p className="col-span-1 text-center font-medium">Assigns</p>
        </div>

        <div className="w-[850px] lg:w-[1150px] xl:w-[1250px] 2xl:w-[1500px] bg-amrblue bg-opacity-10 mt-3 rounded-sm h-[550px] scrollbar-thin">
          {isLoading === true ? (
            <Skeleton count={10} baseColor="#09387a" />
          ) : tasks?.length > 0 ? (
            finalTasks.map((task, index) => (
              <Link href={`/tasks/${routerQuery.spaceId}?taskId=${task.id}`} key={index}>
                <div className="grid grid-cols-12 items-center border-b border-white border-opacity-25 pl-8 pr-2 hover:bg-amrblue hover:bg-opacity-10 cursor-pointer">
                  <p className="col-span-4 py-3 border-r border-white border-opacity-25 text-sm">{task?.name?.substring(0, 45) || 'Task title'}...</p>

                  <Listbox value={task.status} onChange={(s) => handleUpdate({ status: s }, task)}>
                    <div className="relative ml-2 col-span-3 h-full grid place-content-center border-r border-white border-opacity-25">
                      <Listbox.Button className="relative w-32 mx-auto cursor-pointer rounded-full border border-white border-opacity-10 text-xs pl-2.5 py-1.5 pr-8 focus:outline-none focus:ring-0">
                        <span className="rounded-full text-xs inline-block">{task.status}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-48 overflow-y-scroll rounded-md bg-gray-900 py-1 shadow-lg ring-0 focus:outline-none sm:text-sm">
                          {statuses.map((status, index) => (
                            <Listbox.Option
                              key={index}
                              className={({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-gray-900' : ''}`}
                              value={status}
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{status}</span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 right-0 flex items-center pl-3 text-amber-600">
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
                  <div className="col-span-1 py-3 border-r border-white border-opacity-25 h-full">
                    <FlagIcon className={`h-5 w-5 mx-auto ${task?.priority?.color}`} />
                  </div>
                  <p className="col-span-1 text-sm grid place-content-center border-r border-white border-opacity-25 h-full">
                    {!!task?.totalTime
                      ? `${convert(task?.totalTime).hours}hr ${convert(task?.totalTime).minutes}m ${convert(task?.totalTime).seconds}s`
                      : '0 min'}
                  </p>
                  <p className="col-span-2 py-3 border-r border-white border-opacity-25 text-center text-sm h-full">
                    {!!task?.taskDate ? task?.taskDate : 'Unscheduled task'}
                  </p>
                  <p className="text-sm ml-10">{task?.selectedEmployeeName?.substring(0, 5) || 'Name'}...</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="p-44 w-full mx-auto text-center text-lg">No tasks found...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ShowAllTasksByAllUsers;
