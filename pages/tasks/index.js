import Layout from '@/components/common/Layout';
import { FlagIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { collection, getFirestore, onSnapshot, query } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // router
  const { query: routerQuery } = useRouter();

  // getting all tasks
  useEffect(() => {
    if (Object.keys(routerQuery).length > 0) {
      (async () => {
        const q = query(collection(getFirestore(), `spaces/${routerQuery.spaceId}/tasks`));
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
      })();
    }
  }, [routerQuery]);

  return (
    <Layout>
      <div className="grid grid-cols-12 w-11/12 px-8 mx-auto mt-10">
        <p className="col-span-4 font-medium">Title</p>
        <p className="col-span-2 text-center font-medium">Status</p>
        <p className="col-span-2 text-center font-medium">Priority</p>
        <p className="col-span-2 text-center font-medium">Deadline</p>
        <p className="col-span-2 text-center font-medium">Assigns</p>
      </div>
      <div className="w-11/12 px-auto mx-auto bg-amrblue bg-opacity-10 mt-3 rounded-sm h-[550px] overflow-y-scroll scrollbar-thin">
        {isLoading === true ? (
          <Skeleton count={10} baseColor="#09387a" />
        ) : tasks?.length > 0 ? (
          tasks.map((item, index) => (
            <div className="grid grid-cols-12 items-center border-b border-white border-opacity-25 px-8 hover:bg-amrblue hover:bg-opacity-10 cursor-pointer" key={index}>
              <p className="col-span-4 py-3 border-r border-white border-opacity-25">{item?.name || 'Task title'}</p>
              <p className="col-span-2 py-3 border-r border-white border-opacity-25 text-center">
                <span className="bg-amrblue bg-opacity-25 rounded-full px-4 py-1 text-sm">{item.status || 'Status'}</span>
              </p>
              <div className="col-span-2 py-3 border-r border-white border-opacity-25">
                <FlagIcon className={`h-5 w-5 mx-auto ${item?.flagSelected?.color}`} />
              </div>
              <p className="col-span-2 py-3 border-r border-white border-opacity-25 text-center text-sm">{format(item?.taskDate?.toDate(), 'PPP')}</p>
              <div className="col-span-2">
                <div className="h-10 w-10 mx-auto rounded-full relative top-[2px]">
                  <Image src="/assets/images/avatar.png" alt="Picture of the author" fill />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="p-44 w-full mx-auto text-center text-lg">Create some tasks</p>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;
