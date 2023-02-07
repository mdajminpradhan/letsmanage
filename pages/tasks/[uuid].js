import Layout from '@/components/common/Layout';
import { CheckIcon, ChevronUpDownIcon, EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import { FlagIcon, PencilIcon } from '@heroicons/react/24/solid';
import { Menu, Transition, Listbox } from '@headlessui/react';
import MenuTransition from '@/components/common/MenuTransition';
import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { deleteDoc, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import useAppStore from '@/appStore';
import EditTask from '@/components/dashboard/EditTask';

const status = ['To Do', 'In Progress', 'Complete'];

const Tasks = () => {
  const [selected, setSelected] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [task, setTask] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // router
  const { query: query, push, pathname } = useRouter();

  // app global store
  const { userData } = useAppStore((state) => ({
    userData: state.userData
  }));

  // getting all tasks
  useEffect(() => {
    if (Object.keys(query).length > 0) {
      Object.keys(query)[0] == 'taskId' && Object.keys(query)[1] == 'uuid'
        ? (async () => {
            const docRef = doc(getFirestore(), `spaces/${query.uuid}/tasks/`, query.taskId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              setTask(docSnap.data());
              setSelected(docSnap.data().status);
              setIsLoading(false);
            } else {
              console.log('No such document!');
              setTask('');
            }
          })()
        : push('/');
    }
  }, [query]);

  console.log(pathname);

  // deleting task
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteDoc(doc(getFirestore(), `spaces/${query.uuid}/tasks/`, query.taskId));

      push(`/tasks?spaceId=${query.uuid}`);
      setIsDeleting(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (status) => {
    try {
      const docRef = doc(getFirestore(), `spaces/${query.uuid}/tasks/`, query.taskId);
      await updateDoc(docRef, { status: status });

      setSelected(status);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout titleFromChild="Task">
      {isLoading === true ? (
        <p className="p-48 text-center">Fetching your task...</p>
      ) : isDeleting === true ? (
        <p className="p-48 text-center">Deleting your task...</p>
      ) : (
        <>
          <div className="flex justify-between w-11/12 sm:pl-8 pr-4 mx-auto mt-8 sm:mt-5">
            <div className='w-full'>
              <p className="sm:text-xl">{task.name || 'Task name'}</p>
              <div className="grid grid-cols-2 gap-y-6 w-full sm:flex sm:items-center mt-6 sm:mt-4">
                <Listbox value={selected} onChange={handleUpdate}>
                  <div className="relative sm:ml-2">
                    <Listbox.Button className="relative w- cursor-pointer rounded-full border border-white border-opacity-10 px-1 py-1 pb-[5px] pl-2 pr-6 sm:pb-1.5 sm:px-2 sm:py-1.5 sm:pr-8 focus:outline-none focus:ring-0">
                      <span className="bg-amrblue bg-opacity-25 rounded-full px-4 py-1 text-xs sm:text-sm inline-block">{selected}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 sm:pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute mt-1 max-h-60 w-48 overflow-y-scroll rounded-md bg-gray-900 py-1 shadow-lg ring-0 focus:outline-none sm:text-sm">
                        {status.map((item, index) => (
                          <Listbox.Option
                            key={index}
                            className={({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-gray-900' : ''}`}
                            value={item}
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{item}</span>
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

                <FlagIcon className={`h-5 w-5 fill-third ml-10 ${task?.priority?.color}`} />
                <p className="text-sm ml-1.5 sm:ml-10">{!!task?.taskDate ? task?.taskDate : 'Unsceduled task' || 'Task date'}</p>

                <p className="text-sm ml-10">{task?.selectedEmployeeName || 'Name'}</p>
              </div>
            </div>

            {userData?.role !== 'User' && (
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="text-white outline-none focus:ring-0">
                    <EllipsisHorizontalIcon className="h-8 w-8" />
                  </Menu.Button>
                </div>
                <MenuTransition>
                  <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-rightrounded-md shadow-lg bg-amrblue bg-opacity-25 rounded-lg focus:ring-0 focus:outline-none py-2">
                    <div className="px-2 py-2 cursor-pointer hover:bg-gray-900">
                      <Menu.Item>
                        <div className="flex items-center" onClick={() => setIsOpen(true)}>
                          <PencilIcon className="h-6 w-6 stroke-red-400" />
                          <span className="ml-2">Edit</span>
                        </div>
                      </Menu.Item>
                    </div>
                    <div className="px-2 py-2 cursor-pointer hover:bg-gray-900">
                      <Menu.Item>
                        <div className="flex items-center" onClick={handleDelete}>
                          <TrashIcon className="h-6 w-6 stroke-red-400" />
                          <span className="ml-2">{isDeleting === true ? 'Deleting...' : 'Delete'}</span>
                        </div>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </MenuTransition>
              </Menu>
            )}
          </div>

          <div className="max-w-[91%] mx-auto pl-1.5 sm:pl-8 sm:pr-4 mt-10 sm:mt-6">
            <p className="leading-8">{task?.description || 'Description'}</p>

            {task?.subTasks?.length > 0 ? (
              <div className="mt-10">
                <p className="text-sm mt-4 text-gray-400 font-medium mb-4">Subtasks</p>
                {task?.subTasks.map((item, index) => (
                  <div className="flex items-center ml-8 mb-2" key={index}>
                    <span className="bg-amrblue h-1.5 w-1.5 rounded-full block"></span>
                    <p className="ml-4">{item}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </>
      )}

      <EditTask
        isOpen={isOpen}
        setIsOpen={(val) => {
          setIsOpen(val);
        }}
        task={task}
        spaceId={query.uuid}
        taskId={query.taskId}
      />
    </Layout>
  );
};

export default Tasks;
