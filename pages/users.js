import Layout from '@/components/common/Layout';
import Image from 'next/image';
import { TrashIcon } from '@heroicons/react/24/outline';
import { collection, getFirestore, onSnapshot, doc, query, updateDoc, deleteDoc } from 'firebase/firestore';
import { Fragment, useEffect, useState } from 'react';
import { Transition, Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

const Users = () => {
  const [deleteId, setDeleteId] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All Users');
  const [users, setUsers] = useState(['']);

  // getting all users
  useEffect(() => {
    (async () => {
      const q = query(collection(getFirestore(), 'users'));

      onSnapshot(q, (querySnapshot) => {
        const records = [];
        querySnapshot.forEach((doc) => {
          const record = doc.data();
          record.id = doc.id;
          records.push(record);
        });

        setUsers(records);
      });
    })();
  }, []);

  // removing user
  const handleRemove = async (user) => {
    setIsDeleting(true);

    try {
      await deleteDoc(doc(getFirestore(), 'users', user.id));

      setDeleteId('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (whatToUpdate, user) => {
    try {
      const docRef = doc(getFirestore(), 'users', user.id);
      await updateDoc(docRef, whatToUpdate);

      // setSelectedRole(role);
      toast.success('Record has been updated...');
    } catch (error) {
      console.log(error);
    }
  };

  const roles = ['Admin', 'Editor', 'User'];
  const statuses = ['approved', 'pending', 'joined'];

  console.log(selectedStatus, users);

  return (
    <Layout titleFromChild="Users">
      <div className="flex justify-between items-center w-11/12 mx-auto mt-10 mb-8">
        <p className="text-lg mb-4 font-medium w-11/12 mx-auto capitalize">{selectedStatus} Users</p>

        <Listbox value={selectedStatus} onChange={setSelectedStatus}>
          <div className="relative ml-2">
            <Listbox.Button className="relative w-full cursor-pointer rounded-full border border-white border-opacity-10 text-sm px-4 py-2.5 pr-14 focus:outline-none focus:ring-0">
              <span className="block truncate capitalize">{!!selectedStatus ? selectedStatus : 'All Users'}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-60 w-48 overflow-y-scroll rounded-md bg-gray-900 py-1 shadow-lg ring-0 focus:outline-none sm:text-sm">
                <Listbox.Option className={({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-gray-900' : ''}`} value={'All Users'}>
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
                {statuses.length > 0 ? (
                  statuses?.map((status, index) => (
                    <Listbox.Option key={index} className={({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-gray-900' : ''}`} value={status}>
                      {({ selected }) => (
                        <>
                          <span className={`block truncate capitalize ${selected ? 'font-medium' : 'font-normal'}`}>{status}</span>
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
                  <Listbox.Option className={({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-gray-900' : ''}`} value={{ name: 'Select space' }}>
                    <p className="text-sm">No space</p>
                  </Listbox.Option>
                )}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      <div className="grid grid-cols-12 w-11/12 pl-8 pr-1.5 mx-auto">
        <p className="col-span-3 font-medium">Email</p>
        <p className="col-span-2 text-center font-medium">Username</p>
        <p className="col-span-2 text-center font-medium">Status</p>
        <p className="col-span-2 text-center font-medium">Role</p>
        <p className="col-span-2 text-center font-medium">Picture</p>
        <p className="col-span-1 text-center font-medium">Action</p>
      </div>
      <div className="w-11/12 px-auto mx-auto bg-amrblue bg-opacity-10 mt-3 rounded-sm h-[550px] overflow-scroll scrollbar-thin">
        {users?.length > 0 &&
          users.map((user, index) =>
            selectedStatus === 'All Users' ? (
              <div className="grid grid-cols-12 items-center border-b border-white border-opacity-25 pl-8 pr-1 hover:bg-amrblue hover:bg-opacity-10 cursor-pointer" key={index}>
                {console.log('hey')}
                <p className="col-span-3 py-3 border-r border-white border-opacity-25 text-sm">{user.email || 'Email'}</p>
                <p className="col-span-2 py-3 border-r border-white border-opacity-25 text-center text-sm">{user.username || 'Username'}</p>
                <Listbox value={user.status} onChange={(s) => handleUpdate({ status: s }, user)}>
                  <div className="relative ml-2 col-span-2 h-full grid place-content-center border-r border-white border-opacity-25">
                    <Listbox.Button className="relative w-28 mx-auto cursor-pointer rounded-full border border-white border-opacity-10 text-xs pl-2.5 py-1.5 pr-8 focus:outline-none focus:ring-0">
                      <span className="rounded-full text-xs inline-block capitalize">{user.status}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-48 overflow-y-scroll rounded-md bg-gray-900 py-1 shadow-lg ring-0 focus:outline-none sm:text-sm">
                        {statuses.map((item, index) => (
                          <Listbox.Option
                            key={index}
                            className={({ active }) => `relative cursor-pointer select-none text-xs py-2 pl-4 pr-4 ${active ? 'bg-gray-900' : ''}`}
                            value={item}
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate capitalize ${selected ? 'font-medium' : 'font-normal'}`}>{item}</span>
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
                <Listbox value={user.role} onChange={(r) => handleUpdate({ role: r }, user)}>
                  <div className="relative ml-2 col-span-2 h-full grid place-content-center border-r border-white border-opacity-25">
                    <Listbox.Button className="relative w-24 mx-auto cursor-pointer rounded-full border border-white border-opacity-10 text-xs pl-2.5 py-1.5 pr-8 focus:outline-none focus:ring-0">
                      <span className="rounded-full text-xs inline-block">{user.role}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-48 overflow-y-scroll rounded-md bg-gray-900 py-1 shadow-lg ring-0 focus:outline-none sm:text-sm">
                        {roles.map((item, index) => (
                          <Listbox.Option key={index} className={({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-gray-900' : ''}`} value={item}>
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
                {/* <p className="col-span-2 py-3 border-r border-white border-opacity-25 text-center text-sm h-full">{user.role || 'Username'}</p> */}
                <div className="col-span-2 border-r border-white border-opacity-25 h-full">
                  <div className="h-10 w-10 mx-auto rounded-full relative top-[2px]">
                    <Image src="/assets/images/avatar.png" alt="Picture of the author" fill />
                  </div>
                </div>
                {isDeleting === true && deleteId === user.id ? (
                  <p className="col-span-1 text-center text-xs">Deleting...</p>
                ) : (
                  <TrashIcon
                    className="col-span-1 h-5 w-5 mx-auto stroke-red-400 cursor-pointer hover:stroke-red-500"
                    onClick={() => {
                      handleRemove(user);
                      setDeleteId(user.id);
                    }}
                  />
                )}
              </div>
            ) : user.status == selectedStatus && (
              <div className="grid grid-cols-12 items-center border-b border-white border-opacity-25 pl-8 pr-1 hover:bg-amrblue hover:bg-opacity-10 cursor-pointer" key={index}>
                {console.log(user.status===selectedStatus)}

                <p className="col-span-3 py-3 border-r border-white border-opacity-25 text-sm">{user.email || 'Email'}</p>
                <p className="col-span-2 py-3 border-r border-white border-opacity-25 text-center text-sm">{user.username || 'Username'}</p>
                <Listbox value={user.status} onChange={(s) => handleUpdate({ status: s }, user)}>
                  <div className="relative ml-2 col-span-2 h-full grid place-content-center border-r border-white border-opacity-25">
                    <Listbox.Button className="relative w-28 mx-auto cursor-pointer rounded-full border border-white border-opacity-10 text-xs pl-2.5 py-1.5 pr-8 focus:outline-none focus:ring-0">
                      <span className="rounded-full text-xs inline-block capitalize">{user.status}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-48 overflow-y-scroll rounded-md bg-gray-900 py-1 shadow-lg ring-0 focus:outline-none sm:text-sm">
                        {statuses.map((item, index) => (
                          <Listbox.Option
                            key={index}
                            className={({ active }) => `relative cursor-pointer select-none text-xs py-2 pl-4 pr-4 ${active ? 'bg-gray-900' : ''}`}
                            value={item}
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate capitalize ${selected ? 'font-medium' : 'font-normal'}`}>{item}</span>
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
                <Listbox value={user.role} onChange={(r) => handleUpdate({ role: r }, user)}>
                  <div className="relative ml-2 col-span-2 h-full grid place-content-center border-r border-white border-opacity-25">
                    <Listbox.Button className="relative w-24 mx-auto cursor-pointer rounded-full border border-white border-opacity-10 text-xs pl-2.5 py-1.5 pr-8 focus:outline-none focus:ring-0">
                      <span className="rounded-full text-xs inline-block">{user.role}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-48 overflow-y-scroll rounded-md bg-gray-900 py-1 shadow-lg ring-0 focus:outline-none sm:text-sm">
                        {roles.map((item, index) => (
                          <Listbox.Option key={index} className={({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-gray-900' : ''}`} value={item}>
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
                {/* <p className="col-span-2 py-3 border-r border-white border-opacity-25 text-center text-sm h-full">{user.role || 'Username'}</p> */}
                <div className="col-span-2 border-r border-white border-opacity-25 h-full">
                  <div className="h-10 w-10 mx-auto rounded-full relative top-[2px]">
                    <Image src="/assets/images/avatar.png" alt="Picture of the author" fill />
                  </div>
                </div>
                {isDeleting === true && deleteId === user.id ? (
                  <p className="col-span-1 text-center text-xs">Deleting...</p>
                ) : (
                  <TrashIcon
                    className="col-span-1 h-5 w-5 mx-auto stroke-red-400 cursor-pointer hover:stroke-red-500"
                    onClick={() => {
                      handleRemove(user);
                      setDeleteId(user.id);
                    }}
                  />
                )}
              </div>
            )
          )}
      </div>
    </Layout>
  );
};

export default Users;
