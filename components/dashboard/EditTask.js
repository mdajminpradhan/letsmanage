import { Dialog, Transition, Listbox } from '@headlessui/react';
import TransitionChild from '../common/TransitionChild';
import { Fragment, useEffect, useState } from 'react';
import { CalendarDaysIcon, CheckIcon, ChevronUpDownIcon, FlagIcon, PlusSmallIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useAppStore from '@/appStore';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { format } from 'date-fns';

const schema = yup
  .object()
  .shape({
    name: yup.string().required(),
    description: yup.string().required()
  })
  .required();

const priorities = [
  {
    value: 'Urgent',
    color: 'fill-red-500'
  },
  {
    value: 'High',
    color: 'fill-third'
  },
  {
    value: 'Normal',
    color: 'fill-blue-400'
  },
  {
    value: 'Low',
    color: 'fill-gray-400'
  }
];

const EditTask = ({ isOpen, setIsOpen, task, spaceId, taskId }) => {
  const [selectedSpace, setSelectedSpace] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [flagSelected, setFlagSelected] = useState('');
  const [subTasks, setSubTasks] = useState([]);
  const [taskDate, setTaskDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // router
  const { push } = useRouter();

  // app global store
  const { spaces, users } = useAppStore((state) => ({
    spaces: state.spaces,
    users: state.users
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (!!task) {
      reset({ name: task.name, description: task.description });
      // setSelectedUser(task?.selectedEmployee);
      setFlagSelected(task?.priority);
      setTaskDate(task?.taskDate);
      setSubTasks(task?.subTasks || []);

      // user data
      const docRef = doc(getFirestore(), 'users', task?.selectedEmployeeId);
      getDoc(docRef).then((employee) => {
        const record = employee.data();
        record.id = employee.id;

        setSelectedUser(record);
      });

      // space data
      getDoc(task?.selectedSpace).then((space) => {
        const record = space.data();
        record.id = space.id;

        setSelectedSpace(record);
      });
    }
  }, [task]);

  // replacing states
  useEffect(() => {
    if (spaces.length > 0) {
      setSelectedSpace(spaces[0]);
    } else {
      setSelectedSpace({ name: 'Select space' });
    }
  }, [spaces]);

  console.log(spaceId, taskId);

  // updateTask task
  const updateTask = async (formdata) => {
    setIsLoading(true);

    if (selectedUser === '' && flagSelected === '') {
      toast.error('Please all the fields');
      return;
    }

    // extending formdata
    formdata.selectedSpace = doc(getFirestore(), 'spaces', selectedSpace.id);
    formdata.priority = flagSelected;
    formdata.subTasks = subTasks;
    !!taskDate ? (formdata.taskDate = format(taskDate, 'dd/MM/yyyy')) : taskDate;
    formdata.status = 'To Do';
    formdata.selectedEmployeeId = selectedUser?.id;
    formdata.selectedEmployeeName = selectedUser?.name;

    try {
      const docRef = doc(getFirestore(), `spaces/${spaceId}/tasks`, taskId);
      const record = await updateDoc(docRef, formdata);

      push(`/tasks/${selectedSpace.id}?taskId=${record.id}`);
      setIsOpen(false);
      setIsLoading(false);
      setSelectedSpace([]);
      setSelectedUser([]);
      setFlagSelected('');
      setSubTasks([]);
      setTaskDate(new Date());
      reset();
    } catch (error) {
      // showing error in console
      console.log(error);

      // making loading false
      setIsLoading(false);

      // showing toast
      toast.error('Failed to update task...');
    }
  };

  // chaning sub task value
  const handleChange = (task, index) => {
    const allTasks = [...subTasks];
    allTasks[index] = task;
    setSubTasks(allTasks);
  };

  // removing sub task
  const handleRemove = (index) => {
    const allTasks = subTasks.filter((_, i) => i !== index);

    setSubTasks(allTasks);
  };

  const watchAll = watch();

  useEffect(() => {
    // console.log(errors, watchAll);
  }, [errors, watchAll]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
        <TransitionChild>
          <div className="fixed inset-0 bg-black bg-opacity-70" />
        </TransitionChild>

        <div className="fixed right-14 bottom-14 overflow-y-auto flex items-center justify-center p-4 text-center">
          <TransitionChild>
            <Dialog.Panel className="w-[650px] bg-gray-900  transform rounded-lg px-6 py-4 text-left align-middle shadow-xl transition-all">
              <form onSubmit={handleSubmit(updateTask)}>
                <div className="max-h-[450px] overflow-y-scroll scrollbar-thin">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="bg-amrblue h-2 w-2 rounded-sm block"></span>
                      <input
                        type="text"
                        className="px-4 py-2 rounded-lg text-white focus:ring-0 outline-none ring-blue-400 w-full bg-transparent font-medium"
                        id="title"
                        min={5}
                        max={50}
                        required
                        placeholder="Enter space title"
                        autoFocus={true}
                        {...register('name')}
                      />
                    </div>
                    <XMarkIcon className="h-5 w-5 text-white cursor-pointer" onClick={() => setIsOpen(false)} />
                  </div>
                  <div className="flex items-center mt-4">
                    <div className="flex items-center">
                      <span>In</span>

                      <Listbox value={selectedSpace} onChange={setSelectedSpace}>
                        <div className="relative ml-2">
                          <Listbox.Button className="relative w-full cursor-pointer rounded-full border border-white border-opacity-10 text-xs px-4 py-2.5 pr-14 focus:outline-none focus:ring-0">
                            <span className="block truncate">{selectedSpace[0]?.name || selectedSpace.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                          </Listbox.Button>
                          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute mt-1 max-h-60 w-48 overflow-y-scroll rounded-md bg-gray-800 py-1 shadow-lg ring-0 focus:outline-none sm:text-sm">
                              {spaces.length > 0 ? (
                                spaces?.map((space, index) => (
                                  <Listbox.Option
                                    key={index}
                                    className={({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-gray-900' : ''}`}
                                    value={space}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{space.name}</span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-amber-600">
                                            <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))
                              ) : (
                                <Listbox.Option
                                  className={({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-gray-900' : ''}`}
                                  value={{ name: 'Select space' }}
                                >
                                  <p className="text-sm">No space</p>
                                </Listbox.Option>
                              )}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>

                      <span className="px-6">For</span>

                      <Listbox value={selectedUser} onChange={setSelectedUser}>
                        <div className="relative">
                          {selectedUser == '' ? (
                            <div className="h-10 w-10 border border-white border-opacity-30 rounded-full p-1.5">
                              <Listbox.Button className="relative w-full cursor-pointer rounded-full border border-white border-dashed border-opacity-30 text-xs p-[2px] focus:outline-none focus:ring-0">
                                <UserGroupIcon className="h-5 w-5 text-white stroke-[.5] stroke-gray-300" />
                                <PlusSmallIcon className="h-2 w-2 text-white bg-gray-500 rounded-full absolute right-0 bottom-0 p-0" aria-hidden="true" />
                              </Listbox.Button>
                            </div>
                          ) : (
                            <Listbox.Button className="h-10 w-10 rounded-full relative cursor-pointer">
                              <Image src="/assets/images/avatar.png" alt="Picture of the author" fill />
                              <XMarkIcon className="h-3 w-3 text-white cursor-pointer absolute right-1 top-1 bg-gray-500 rounded-full hover:bg-gray-400" />
                            </Listbox.Button>
                          )}

                          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute mt-1 py-2 h-60 w-64 overflow-y-scroll rounded-md bg-gray-800 shadow-lg ring-0 focus:outline-none sm:text-sm px-2">
                              {users.map((user, index) => (
                                <Listbox.Option
                                  key={index}
                                  className={({ active }) => `flex items-center relative cursor-pointer select-none py-1 px-2 rounded-md ${active ? 'bg-gray-900' : ''}`}
                                  value={user}
                                >
                                  {({ selected }) => (
                                    <>
                                      <div className="h-10 w-10 rounded-full relative">
                                        <Image src="/assets/images/avatar.png" alt="Picture of the author" fill />
                                      </div>
                                      <span className={`block truncate ml-2 ${selected ? 'font-medium' : 'font-normal'}`}>{user.name}</span>
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
                    </div>
                  </div>

                  <div className="mt-5">
                    <textarea
                      type="text"
                      className="text-sm px-4 py-2 rounded-sm border border-white border-opacity-[10%] text-white focus:ring-0 outline-none ring-blue-400 w-full bg-transparent font-medium"
                      id="title"
                      min={5}
                      max={50}
                      required
                      placeholder="Description"
                      rows={7}
                      {...register('description')}
                    ></textarea>
                  </div>

                  {subTasks.length > 0 ? (
                    <div>
                      <p className="text-sm mt-4 text-gray-400 font-medium">Subtasks</p>
                      {subTasks.map((task, index) => (
                        <div className="flex justify-between items-center ml-1" key={index}>
                          <div className="flex items-center">
                            <span className="bg-amrblue h-1.5 w-1.5 rounded-full block"></span>
                            <input
                              type="text"
                              className="px-4 py-2 rounded-lg text-gray-300 focus:ring-0 outline-none ring-blue-400 w-full bg-transparent text-sm font-medium"
                              id="title"
                              min={5}
                              max={50}
                              required
                              placeholder="Enter space title"
                              autoFocus={true}
                              value={task}
                              onChange={(event) => handleChange(event.target.value, index)}
                            />
                          </div>
                          <TrashIcon className="h-5 w-5  stroke-red-400 cursor-pointer hover:stroke-red-500" onClick={() => handleRemove(index)} />
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex items-center mt-4 cursor-pointer ml-1" onClick={() => setSubTasks((prev) => [...prev, ''])}>
                    <PlusSmallIcon className="h-4 w-4 text-white bg-amrblue rounded-sm" />
                    <p className="text-xs ml-2 hover:text-gray-300">Add subtask</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-8 w-full">
                  <div className="flex items-center">
                    <Listbox value={flagSelected} onChange={setFlagSelected}>
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-pointer text-xs focus:outline-none focus:ring-0">
                          {flagSelected == '' ? (
                            <FlagIcon className="h-8 w-8 mx-auto fill-gray-400 p-1.5 rounded-full border border-white border-dashed border-opacity-30 text-xs" />
                          ) : (
                            <FlagIcon
                              className={`h-8 w-8 mx-auto p-1.5 cursor-pointer border border-transparent border-dashed ${flagSelected?.color}`}
                              onClick={() => setFlagSelected('')}
                            />
                          )}
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <Listbox.Options className="absolute z-20 bottom-1 pt-2.5 mt-1 h-auto w-44 overflow-y-scroll rounded-md bg-gray-800 shadow-lg ring-0 focus:outline-none sm:text-sm">
                            {priorities.map((priority, index) => (
                              <Listbox.Option
                                key={index}
                                className={({ active }) => `flex items-center relative cursor-pointer select-none py-2 pl-3 pr-2 mb-2 ${active ? 'bg-gray-900' : ''}`}
                                value={priority}
                              >
                                <FlagIcon className={`h-5 w-5 ${priority.color}`} />
                                <span className="ml-3 font-medium">{priority.value}</span>
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>

                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-5 w-5 text-white ml-5 relative -top-1" title="Start date" />
                      <DatePicker
                        selected={taskDate}
                        onChange={(date) => setTaskDate(date)}
                        className="bg-transparent relative -top-1 cursor-pointer focus:ring-0 outline-none ml-2 text-sm"
                        title="Start date"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Task date"
                      />
                    </div>
                  </div>

                  <button
                    type={isLoading === true ? 'button' : 'submit'}
                    className={` ${
                      selectedSpace.name === 'Select space' ? 'bg-gray-700' : 'bg-amrblue hover:bg-hoverPrimary transform hover:scale-95 transition-all duration-300'
                    }  px-4 py-2 rounded-sm text-sm text-white font-medium focus:ring-0 outline-none`}
                  >
                    {isLoading === true ? 'Updating...' : 'Update Task'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditTask;
