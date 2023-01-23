import { FlagIcon } from '@heroicons/react/24/solid';
import { Fragment, useEffect, useState } from 'react';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Link from 'next/link';
import useAppStore from '@/appStore';
import { Transition, Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

// task status
const statuses = ['To Do', 'In Progress', 'Complete', 'Closed'];

const ShowTasksByMyId = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('To Do');

  // router
  const { query: routerQuery } = useRouter();

  // app global store
  const { userData } = useAppStore((state) => ({
    userData: state.userData
  }));

  // getting all tasks
  useEffect(() => {
    if (Object.keys(routerQuery).length > 0) {
      // query
      const q = query(
        collection(getFirestore(), `spaces/${routerQuery.spaceId}/tasks`),
        where('selectedEmployeeId', '==', userData?.id),
        where('status', '==', selectedStatus)
      );

      // getting data
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
    }
  }, [routerQuery, selectedStatus]);

  return (
    <>
      <div className="flex justify-between items-center w-11/12 mx-auto mt-10 mb-6">
        <p className="text-lg">All Tasks</p>

        <div className="flex items-center">
          <Listbox value={selectedStatus} onChange={setSelectedStatus}>
            <div className="relative ml-2">
              <Listbox.Button className="relative w-full cursor-pointer rounded-full border border-white border-opacity-10 text-sm px-4 py-2.5 pr-14 focus:outline-none focus:ring-0">
                <span className="block truncate">{!!selectedStatus ? selectedStatus : 'All Tasks'}</span>
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
        </div>
      </div>

      <div className="grid grid-cols-12 w-11/12 overflow-scroll px-8 mx-auto">
        <p className="col-span-4 font-medium">Title</p>
        <p className="col-span-3 text-center font-medium">Status</p>
        <p className="col-span-1 text-center font-medium">Priority</p>
        <p className="col-span-2 text-center font-medium">Deadline</p>
        <p className="col-span-2 text-center font-medium">Assigns</p>
      </div>
      <div className="w-11/12 px-auto mx-auto bg-amrblue bg-opacity-10 mt-3 rounded-sm h-[550px] overflow-scroll scrollbar-thin">
        {isLoading === true ? (
          <Skeleton count={10} baseColor="#09387a" />
        ) : tasks?.length > 0 ? (
          tasks.map((task, index) => (
            <Link href={`/tasks/${routerQuery.spaceId}?taskId=${task.id}`} key={index}>
              <div className="grid grid-cols-12 items-center border-b border-white border-opacity-25 pl-8 pr-2 hover:bg-amrblue hover:bg-opacity-10 cursor-pointer">
                <p className="col-span-4 py-3 border-r border-white border-opacity-25 text-sm">{task?.name || 'Task title'}</p>

                <div className="col-span-3 h-full border-r border-white border-opacity-25 grid place-content-center">
                  <p className="bg-amrblue bg-opacity-25 rounded-full px-3 py-1.5 text-center text-sm w-24 mx-auto">
                    {task?.status || 'Task status'}
                  </p>
                </div>
                <div className="col-span-1 py-3 border-r border-white border-opacity-25 h-full">
                  <FlagIcon className={`h-5 w-5 mx-auto ${task?.priority?.color}`} />
                </div>
                <p className="col-span-2 py-3 border-r border-white border-opacity-25 text-center text-sm h-full">
                  {!!task?.taskDate ? task?.taskDate : 'Unscheduled task'}
                </p>
                <p className="text-sm ml-10">{task?.selectedEmployee?.username || 'Name'}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="p-44 w-full mx-auto text-center text-lg">No tasks found...</p>
        )}
      </div>
    </>
  );
};

export default ShowTasksByMyId;
