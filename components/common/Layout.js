import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { PlusIcon } from '@heroicons/react/24/solid';

// importing components
import CreateTask from './CreateTask';
import LayoutLeft from './LayoutLeft';

// import utils
import WithAuthentication from '@/utils/WithAuthentication';
import useAppStore from '@/appStore';
import ShortcusOpen from './ShortcusOpen';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

const Layout = ({ children }) => {
  const { pathname } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isShortcusOpen, setIsShortcusOpen] = useState(false);
  const [title, setTitle] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // app global store
  const { isCreateTaskOpen, setIsCreateTaskOpen } = useAppStore((state) => ({
    isCreateTaskOpen: state.isCreateTaskOpen,
    setIsCreateTaskOpen: state.setIsCreateTaskOpen
  }));

  // router
  const { query: routerQuery } = useRouter();

  // getting all tasks
  useEffect(() => {
    if (Object.keys(routerQuery).length > 0) {
      (async () => {
        const docRef = doc(getFirestore(), 'spaces', routerQuery.spaceId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTitle(docSnap.data().name);
          setIsLoading(false);
        } else {
          console.log('No such document!');
        }
      })();
    }
  }, [routerQuery]);

  useEffect(() => {
    setIsOpen(isCreateTaskOpen);
  }, [isCreateTaskOpen]);

  return (
    <WithAuthentication>
      <section className="h-screen overflow-hidden bg-silent bg-no-repeat bg-cover app-layout">
        <section>
          <LayoutLeft />
        </section>
        <section>
          <div className="flex justify-between items-center px-8 mt-8">
            {pathname === '/' ? (
              isLoading ? (
                <p className="text-xl">Fetching...</p>
              ) : (
                <h2 className="text-xl font-medium">{title || 'Space'}</h2>
              )
            ) : (
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-lg bg-white bg-opacity-10 grid place-content-center">
                  <span className="h-5 w-5 rounded-full border-[5px] border-secondary block"></span>
                </div>
                <h2 className="text-xl font-medium ml-2">{title}</h2>
              </div>
            )}

            <div className="flex items-center"></div>

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
                  <div className="px-1 py-1 relative">
                    <Menu.Item>
                      <button className={`group flex w-full items-center rounded-md px-2 py-2 text-sm`}>Profile</button>
                    </Menu.Item>
                    <Menu.Item>
                      <button className={`group flex w-full items-center rounded-md px-2 py-2 text-sm`}>Invite</button>
                    </Menu.Item>
                    <Menu.Item>
                      <button className={`group flex w-full items-center rounded-md px-2 py-2 text-sm`} onClick={() => setIsShortcusOpen(true)}>
                        Shortcuts
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          {children}
        </section>
        <div className="fixed right-5 bottom-5 bg-primary transform hover:scale-95 transition-all duration-200 h-10 w-10 rounded-xl grid place-content-center cursor-pointer">
          <PlusIcon
            className="h-6 w-6 text-white"
            onClick={() => {
              setIsOpen(true);
              setIsCreateTaskOpen(true);
            }}
          />
        </div>
      </section>
      <CreateTask
        isOpen={isOpen}
        setIsOpen={(val) => {
          setIsOpen(val);
          setIsCreateTaskOpen(val);
        }}
      />
      <ShortcusOpen isOpen={isShortcusOpen} setIsOpen={(val) => setIsShortcusOpen(val)} />
    </WithAuthentication>
  );
};

export default Layout;
