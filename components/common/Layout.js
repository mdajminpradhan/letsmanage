import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { PlusIcon } from '@heroicons/react/24/solid';
import { collection, getFirestore, onSnapshot, where, doc, query, getDoc } from 'firebase/firestore';

// importing components
import CreateTask from '../dashboard/CreateTask';
import LayoutLeft from './LayoutLeft';

// import utils
import WithAuthentication from '@/utils/WithAuthentication';
import useAppStore from '@/appStore';
import ShortcusOpen from './ShortcusOpen';
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import CopyInvite from '../dashboard/CopyInvite';

const Layout = ({ titleFromChild = '', children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShortcusOpen, setIsShortcusOpen] = useState(false);
  const [isCopyInviteOpen, setIsCopyInviteOpen] = useState(false);
  const [title, setTitle] = useState([]);

  // app global store
  const { isCreateTaskOpen, setIsCreateTaskOpen, userData, setSpaces, setUsers } = useAppStore((state) => ({
    isCreateTaskOpen: state.isCreateTaskOpen,
    setIsCreateTaskOpen: state.setIsCreateTaskOpen,
    userData: state.userData,
    setSpaces: state.setSpaces,
    setUsers: state.setUsers
  }));

  // router
  const { query: routerQuery } = useRouter();

  // getting all tasks
  useEffect(() => {
    if (titleFromChild === '') {
      if (Object.keys(routerQuery).length > 0) {
        Object.keys(routerQuery).length == 1
          ? (async () => {
              const docRef = doc(getFirestore(), 'spaces', routerQuery.spaceId);
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                setTitle(docSnap.data().name);
              } else {
                console.log('No such document!');
              }
            })()
          : Object.keys(routerQuery).length > 1
          ? (async () => {
              const docRef = doc(getFirestore(), 'spaces', routerQuery.uuid);
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                setTitle(docSnap.data().name);
              } else {
                console.log('No such document!');
              }
            })()
          : setTitle('Task');
      }
    }
  }, [routerQuery]);

  // getting all spaces
  useEffect(() => {
    (async () => {
      const q = query(collection(getFirestore(), 'spaces'));

      onSnapshot(q, (querySnapshot) => {
        const records = [];
        querySnapshot.forEach((doc) => {
          const record = doc.data();
          record.id = doc.id;

          records.push(record);
        });
        setSpaces(records);
      });
    })();
  }, []);

  // getting all users
  useEffect(() => {
    (async () => {
      const q = query(collection(getFirestore(), 'users'), where('status', '==', 'approved'));

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

  useEffect(() => {
    setIsOpen(isCreateTaskOpen);
  }, [isCreateTaskOpen]);

  return (
    <WithAuthentication>
      <section className={`h-screen overflow-hidden bg-silent bg-no-repeat bg-cover ${userData?.role !== 'User' ? 'app-layout' : ''}`}>
        {userData?.role !== 'User' && (
          <section>
            <LayoutLeft />
          </section>
        )}

        <section className="overflow-x-scroll">
          <div className={`flex justify-between items-center px-8 ${userData?.role !== 'User' ? 'mt-8' : 'mt-5'}`}>
            {userData?.role == 'User' ? (
              <div className="flex items-center">
                <div className="flex items-center pl-4">
                  <p className="h-9 w-9 rounded-xl bg-[#2094FF] bg-opacity-[25%] flex justify-center items-center mr-2 font-medium text-sm">LM</p>
                  <p className="text-white text-xl">Let&apos;s Manage</p>
                </div>
                <Link href="/" legacyBehavior>
                  <div className="flex items-center cursor-pointer relative left-10 mt-1">
                    <div className="h-8 w-8 relative">
                      <Image src="/assets/icons/house.png" alt="Picture of the author" fill className="object-contain	" />
                    </div>
                    <a className="w-full ml-2">Dashboard</a>
                  </div>
                </Link>
                <Link href={`/tasks?spaceId=${userData?.departmentId}`} legacyBehavior>
                  <a className="pl-11 flex items-center mt-1">
                    <span className="bg-secondary h-1.5 w-1.5 rounded-full block mr-2"></span>
                    <span>{userData?.department || 'Department name'}</span>
                  </a>
                </Link>
              </div>
            ) : null}

            {userData?.role !== 'User' && (
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-lg bg-white bg-opacity-10 grid place-content-center">
                  <span className="h-5 w-5 rounded-full border-[5px] border-secondary block"></span>
                </div>
                {titleFromChild !== '' ? <h2 className="text-xl font-medium ml-2">{titleFromChild}</h2> : <h2 className="text-xl font-medium ml-2">{title}</h2>}
              </div>
            )}

            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="flex items-center px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-0">
                  <div className="h-12 w-12 rounded-full relative">
                    <Image src="/assets/images/avatar.png" alt="Picture of the author" fill />
                  </div>
                  <ChevronDownIcon className="h-6 w-6 relative -left-1 text-white" aria-hidden="true" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y rounded-md bg-amrblue bg-opacity-25 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1 relative">
                    <div className="pl-2 pt-2 pb-2 border-b border-white border-opacity-25">
                      <p>{userData?.name?.substring(0, 15) + '...'}</p>
                      <p className="text-xs">{userData?.email?.substring(0, 20) + '...'}</p>
                    </div>
                    {/* {userData?.role !== 'User' && ( */}
                    {/* //TODO: uncoment the logic */}
                    <>
                      <Menu.Item>
                        <button className={`group flex w-full items-center rounded-md px-4 py-2 text-sm`}>Profile</button>
                      </Menu.Item>
                      <Menu.Item>
                        <button className={`group flex w-full items-center rounded-md px-4 py-2 text-sm`} onClick={() => setIsCopyInviteOpen(true)}>
                          Invite
                        </button>
                      </Menu.Item>
                    </>
                    {/* )} */}
                    <Menu.Item>
                      <button className={`group flex w-full items-center rounded-md px-4 py-2 text-sm`} onClick={() => setIsShortcusOpen(true)}>
                        Shortcuts
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button className={`group flex w-full items-center rounded-md px-4 py-2 text-sm`} onClick={() => signOut(getAuth())}>
                        Logout
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          {children}
        </section>
        {userData?.role !== 'User' && (
          <div className="fixed right-5 bottom-5 bg-primary transform hover:scale-95 transition-all duration-200 h-10 w-10 rounded-xl grid place-content-center cursor-pointer">
            <PlusIcon
              className="h-6 w-6 text-white"
              onClick={() => {
                setIsOpen(true);
                setIsCreateTaskOpen(true);
              }}
            />
          </div>
        )}
      </section>
      <CreateTask
        isOpen={isOpen}
        setIsOpen={(val) => {
          setIsOpen(val);
          setIsCreateTaskOpen(val);
        }}
      />
      <ShortcusOpen isOpen={isShortcusOpen} setIsOpen={(val) => setIsShortcusOpen(val)} />
      <CopyInvite isOpen={isCopyInviteOpen} setIsOpen={(val) => setIsCopyInviteOpen(val)} />
    </WithAuthentication>
  );
};

export default Layout;
