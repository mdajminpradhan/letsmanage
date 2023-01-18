import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusSmallIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import CreateSpace from './CreateSpace';
import { collection, query, getFirestore, onSnapshot, where } from 'firebase/firestore';
import useAppStore from '@/appStore';

const LayoutLeft = () => {
  const [isOpen, setIsOpen] = useState(false);

  // app global store
  const { isCreateSpaceOpen, setIsCreateSpaceOpen, spaces, setSpaces, setUsers } = useAppStore((state) => ({
    isCreateSpaceOpen: state.isCreateSpaceOpen,
    setIsCreateSpaceOpen: state.setIsCreateSpaceOpen,
    spaces: state.spaces,
    setSpaces: state.setSpaces,
    users: state.users,
    setUsers: state.setUsers,
  }));

  useEffect(() => {
    setIsOpen(isCreateSpaceOpen);
  }, [isCreateSpaceOpen]);

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
        <ul className="mt-2">
          {spaces?.length > 0 ? (
            spaces?.map((record, index) => (
              <li className="hover:bg-white hover:bg-opacity-10 py-2 w-full" key={index}>
                <Link href={`/tasks?spaceId=${record.id}`} legacyBehavior>
                  <a className="pl-11 flex items-center">
                    <span className="bg-secondary h-1.5 w-1.5 rounded-full block mr-2"></span>
                    <span>{record.name || 'Space title'}</span>
                  </a>
                </Link>
              </li>
            ))
          ) : (
            <p className="text-xs pl-8">Create a new space</p>
          )}
        </ul>

        {/* dashboard link goes here */}
        <Link href="/users" legacyBehavior>
          <div className="flex items-center px-4 py-1 mt-6 cursor-pointer hover:bg-amrblue hover:bg-opacity-20">
            <div className="h-8 w-8 relative">
              <Image src="/assets/icons/users.png" alt="Picture of the author" fill />
            </div>
            <a className="w-full ml-2">Users</a>
          </div>
        </Link>
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
