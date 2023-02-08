import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EllipsisHorizontalIcon, PlusSmallIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import CreateSpace from 'components/dashboard/CreateSpace';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import useAppStore from '@/appStore';
import { Menu } from '@headlessui/react';
import MenuTransition from 'components/common/MenuTransition';
import { ClockIcon, TrashIcon } from '@heroicons/react/24/outline';

const LayoutLeft = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // app global store
  const { isCreateSpaceOpen, setIsCreateSpaceOpen, spaces, userData } = useAppStore((state) => ({
    isCreateSpaceOpen: state.isCreateSpaceOpen,
    setIsCreateSpaceOpen: state.setIsCreateSpaceOpen,
    spaces: state.spaces,
    userData: state.userData
  }));

  useEffect(() => {
    setIsOpen(isCreateSpaceOpen);
  }, [isCreateSpaceOpen]);

  // deleting task
  const handleDelete = async (spaceId) => {
    setIsDeleting(true);

    try {
      await deleteDoc(doc(getFirestore(), 'spaces', spaceId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-[#2094FF] bg-opacity-[13%] w-full h-full block">
        {/* compnay name goes here */}
        <div className="flex items-center mb-5 pl-4">
          <p className="h-9 w-9 rounded-xl bg-[#2094FF] bg-opacity-[25%] flex justify-center items-center mr-2 font-medium text-sm">LM</p>
          <p className="text-white text-xl pt-8 mb-8">Let&apos;s Manage</p>
        </div>

        {/* dashboard link goes here */}
        <Link href="/" legacyBehavior>
          <div className="flex items-center bg-white bg-opacity-10 px-4 py-1 cursor-pointer">
            <div className="h-8 w-8 relative">
              <Image src="/assets/icons/house.png" alt="Picture of the author" fill />
            </div>
            <a className="w-full ml-2">Dashboard</a>
          </div>
        </Link>

        {/* spaces starts here */}
        <div className="flex justify-between mt-10 mb-2 pl-6 pr-2 items-center">
          <h3 className="text-blue-100">Spaces</h3>
          <PlusSmallIcon
            className="h-7 w-7 text-white bg-white bg-opacity-10 hover:bg-opacity-20 rounded-md p-1 cursor-pointer"
            onClick={() => {
              setIsOpen(true);
              setIsCreateSpaceOpen(true);
            }}
          />
        </div>

        {/* spaces loop starts here */}
        <ul className="mt-4">
          {spaces?.length > 0 ? (
            spaces?.map((record, index) => (
              <li className="hover:bg-white hover:bg-opacity-10 py-2 w-full flex justify-between items-center" key={index}>
                <Link href={`/tasks?spaceId=${record.id}`} legacyBehavior>
                  <a className="pl-11 flex items-center">
                    <span className="bg-secondary h-1.5 w-1.5 rounded-full block mr-2"></span>
                    <span>{record.name || 'Space title'}</span>
                  </a>
                </Link>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="text-white outline-none focus:ring-0 pr-3">
                      <EllipsisHorizontalIcon className="h-6 w-6" />
                    </Menu.Button>
                  </div>
                  <MenuTransition>
                    <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-rightrounded-md shadow-lg bg-amrblue bg-opacity-25 rounded-lg focus:ring-0 focus:outline-none">
                      <div className="px-2 py-2 cursor-pointer">
                        <Menu.Item>
                          <div className="flex items-center" onClick={() => handleDelete(record.id)}>
                            <TrashIcon className="h-6 w-6 stroke-red-400" />
                            <span className="ml-2">{isDeleting === true ? 'Deleting...' : 'Delete'}</span>
                          </div>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </MenuTransition>
                </Menu>
              </li>
            ))
          ) : (
            <p className="text-xs pl-8">Create a new space</p>
          )}
        </ul>

        {/* users link goes here */}
        {userData?.role === 'Admin' && (
          <Link href="/users" legacyBehavior>
            <div className="flex items-center px-4 py-1 mt-6 cursor-pointer hover:bg-amrblue hover:bg-opacity-20">
              <div className="h-7 w-7 relative">
                <Image src="/assets/icons/users.png" alt="Picture of the author" fill />
              </div>
              <a className="w-full ml-2">Users</a>
            </div>
          </Link>
        )}

        {/* users link goes here */}
        {userData?.role === 'Admin' || userData?.role === 'Team Leader' ? (
          <Link href="/timesheets" legacyBehavior>
            <div className="flex items-center px-4 py-[5px] mt-4 cursor-pointer hover:bg-amrblue hover:bg-opacity-20">
              <ClockIcon className='h-6 w-6 stroke-third' />
              <a className="w-full ml-2">Timesheets</a>
            </div>
          </Link>
        ) : null}
      </div>
      <CreateSpace
        isOpen={isOpen}
        setIsOpen={(val) => {
          setIsOpen(val);
          setIsCreateSpaceOpen(val);
        }}
      />
    </>
  );
};

export default LayoutLeft;
