import useAppStore from '@/appStore';
import Layout from '@/components/common/Layout';
import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { FlagIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Home = () => {
  // states
  const [todayTasks, setTodayTasks] = useState([]);
  const [overDueTaks, setOverDueTaks] = useState([]);
  const [nextTasks, setNextTasks] = useState([]);
  const [unscheduledTasks, setUnscheduledTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // app global store
  const { userData } = useAppStore((state) => ({
    userData: state.userData
  }));

  // getting all tasks
  useEffect(() => {
    (async () => {
      if (Object.keys(userData).length > 0) {
        // query
        const q = query(
          collection(getFirestore(), `spaces/${userData?.departmentId}/tasks`),
          where('status', 'in', ['To Do', 'In Progress', 'Complete', 'Delay']),
          where('selectedEmployeeId', '==', userData?.id),
          where('taskDate', '==', format(new Date(Date.now()), 'dd/MM/yyyy'))
        );

        // getting data
        onSnapshot(q, (querySnapshot) => {
          const records = [];
          querySnapshot.forEach(async (doc) => {
            const record = doc.data();
            record.id = doc.id;
            records.push(record);
          });

          // setting values
          setTodayTasks(records);
          setIsLoading(false);
        });
      }
    })();
  }, [userData]);

  // getting overdue tasks
  useEffect(() => {
    (async () => {
      if (Object.keys(userData).length > 0) {
        // query
        const q = query(
          collection(getFirestore(), `spaces/${userData?.departmentId}/tasks`),
          where('status', 'in', ['To Do', 'In Progress', 'Complete', 'Delay']),
          where('selectedEmployeeId', '==', userData?.id),
          where('taskDate', '!=', ""),
          where('taskDate', '<', format(new Date(Date.now()), 'dd/MM/yyyy'))
        );

        // getting data
        onSnapshot(q, (querySnapshot) => {
          const records = [];
          querySnapshot.forEach(async (doc) => {
            const record = doc.data();
            record.id = doc.id;
            records.push(record);
          });

          // setting values
          setOverDueTaks(records);
          setIsLoading(false);
        });
      }
    })();
  }, [userData]);

  // getting next tasks
  useEffect(() => {
    (async () => {
      if (Object.keys(userData).length > 0) {
        // query
        const q = query(
          collection(getFirestore(), `spaces/${userData?.departmentId}/tasks`),
          where('status', 'in', ['To Do', 'In Progress', 'Complete', 'Delay']),
          where('selectedEmployeeId', '==', userData?.id),
          where('taskDate', '>', format(new Date(Date.now()), 'dd/MM/yyyy'))
        );

        // getting data
        onSnapshot(q, (querySnapshot) => {
          const records = [];
          querySnapshot.forEach(async (doc) => {
            const record = doc.data();
            record.id = doc.id;
            records.push(record);
          });

          // setting values
          setNextTasks(records);
          setIsLoading(false);
        });
      }
    })();
  }, [userData]);

  // getting unscheduled tasks
  useEffect(() => {
    (async () => {
      if (Object.keys(userData).length > 0) {
        // query
        const q = query(
          collection(getFirestore(), `spaces/${userData?.departmentId}/tasks`),
          where('status', 'in', ['To Do', 'In Progress', 'Complete', 'Delay']),
          where('selectedEmployeeId', '==', userData?.id),
          where('taskDate', '==', '')
        );

        // getting data
        onSnapshot(q, (querySnapshot) => {
          const records = [];
          querySnapshot.forEach(async (doc) => {
            const record = doc.data();
            record.id = doc.id;
            records.push(record);
          });

          // setting values
          setUnscheduledTasks(records);
          setIsLoading(false);
        });
      }
    })();
  }, [userData]);

  return (
    <Layout titleFromChild="Dashboard">
      <div className="w-11/12 mx-auto px-8 pt-10">
        <p className="text-lg mb-4 font-medium">My Tasks</p>
        <div className="max-w-3xl rounded-2xl">
          <div className="mb-4 block">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full bg-amrblue bg-opacity-10 rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring-0">
                    <ChevronRightIcon className={`${open ? 'rotate-90 transform' : ''} h-[22px] w-[22px] text-purple-500`} />
                    <span className="ml-2">Today</span>
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 pl-11">
                    {isLoading ? (
                      <Skeleton count={5} baseColor="#09387a" height={25} className="mb-3" />
                    ) : (
                      todayTasks.map((task, index) => (
                        <Link href={`tasks/${userData?.departmentId}/?taskId=${task.id}`} key={index}>
                          <div className="flex justify-between items-center mb-5 cursor-pointer hover:bg-amrblue hover:bg-opacity-10 py-2 hover:px-1.5 transition-all duration-300 rounded-sm">
                            <div className="flex items-center">
                              <span className="bg-secondary h-1.5 w-1.5 rounded-full block mr-2"></span>
                              <span>{task.name || 'Task name'}</span>
                            </div>
                            <div className="flex items-center">
                              <FlagIcon className={`h-5 w-5 ${task?.priority?.color}`} />
                              <p className="ml-8 mr-2">{task?.taskDate}</p>
                              <p className="ml-8 mr-2 bg-amrblue bg-opacity-25 px-2 py-[2px] text-sm rounded-xl">{task?.status}</p>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
          <div className="mb-4 block">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full bg-amrblue bg-opacity-10 rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring-0">
                    <ChevronRightIcon className={`${open ? 'rotate-90 transform' : ''} h-[22px] w-[22px] text-purple-500`} />
                    <span className="ml-2">Overdue</span>
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 pl-11">
                    {isLoading ? (
                      <Skeleton count={5} baseColor="#09387a" height={25} className="mb-3" />
                    ) : (
                      overDueTaks.map((task, index) => (
                        <Link href={`tasks/${userData?.departmentId}/?taskId=${task.id}`} key={index}>
                          <div className="flex justify-between items-center mb-5 cursor-pointer hover:bg-amrblue hover:bg-opacity-10 py-2 hover:px-1.5 transition-all duration-300 rounded-sm">
                            <div className="flex items-center">
                              <span className="bg-secondary h-1.5 w-1.5 rounded-full block mr-2"></span>
                              <span>{task.name || 'Task name'}</span>
                            </div>
                            <div className="flex items-center">
                              <FlagIcon className={`h-5 w-5 ${task?.priority?.color}`} />
                              <p className="ml-8 mr-2">{task?.taskDate}</p>
                              <p className="ml-8 mr-2 bg-amrblue bg-opacity-25 px-2 py-[2px] text-sm rounded-xl">{task?.status}</p>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
          <div className="mb-4 block">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full bg-amrblue bg-opacity-10 rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring-0">
                    <ChevronRightIcon className={`${open ? 'rotate-90 transform' : ''} h-[22px] w-[22px] text-purple-500`} />
                    <span className="ml-2">Next</span>
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 pl-11">
                    {isLoading ? (
                      <Skeleton count={5} baseColor="#09387a" height={25} className="mb-3" />
                    ) : (
                      nextTasks.map((task, index) => (
                        <Link href={`tasks/${userData?.departmentId}/?taskId=${task.id}`} key={index}>
                          <div className="flex justify-between items-center mb-5 cursor-pointer hover:bg-amrblue hover:bg-opacity-10 py-2 hover:px-1.5 transition-all duration-300 rounded-sm">
                            <div className="flex items-center">
                              <span className="bg-secondary h-1.5 w-1.5 rounded-full block mr-2"></span>
                              <span>{task.name || 'Task name'}</span>
                            </div>
                            <div className="flex items-center">
                              <FlagIcon className={`h-5 w-5 ${task?.priority?.color}`} />
                              <p className="ml-8 mr-2 bg-amrblue bg-opacity-25 px-2 py-[2px] text-sm rounded-xl">{task?.status}</p>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
          <div className="mb-4 block">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full bg-amrblue bg-opacity-10 rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring-0">
                    <ChevronRightIcon className={`${open ? 'rotate-90 transform' : ''} h-[22px] w-[22px] text-purple-500`} />
                    <span className="ml-2">Unscheduled</span>
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 pl-11">
                    {isLoading ? (
                      <Skeleton count={5} baseColor="#09387a" height={25} className="mb-3" />
                    ) : (
                      unscheduledTasks.map((task, index) => (
                        <Link href={`tasks/${userData?.departmentId}/?taskId=${task.id}`} key={index}>
                          <div className="flex justify-between items-center mb-5 cursor-pointer hover:bg-amrblue hover:bg-opacity-10 py-2 hover:px-1.5 transition-all duration-300 rounded-sm">
                            <div className="flex items-center">
                              <span className="bg-secondary h-1.5 w-1.5 rounded-full block mr-2"></span>
                              <span>{task.name || 'Task name'}</span>
                            </div>
                            <div className="flex items-center">
                              <FlagIcon className={`h-5 w-5 ${task?.priority?.color}`} />
                              <p className="ml-8 mr-2 bg-amrblue bg-opacity-25 px-2 py-[2px] text-sm rounded-xl">{task?.status}</p>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
