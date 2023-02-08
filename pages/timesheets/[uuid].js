import { useEffect, useState, Fragment } from 'react';
import Layout from '@/components/common/Layout';
import { EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import MenuTransition from '@/components/common/MenuTransition';
import { useRouter } from 'next/router';
import { deleteDoc, doc, getDoc, getFirestore } from 'firebase/firestore';
import useAppStore from '@/appStore';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { Dialog, Transition } from '@headlessui/react';
import TransitionChild from '@/components/common/TransitionChild';
var convert = require('convert-seconds');

const Tasks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [timesheet, setTimesheet] = useState(true);
  const [isOpen, setIsOpen] = useState('');
  const [imageId, setImageId] = useState('');

  // router
  const { query: query, push, pathname } = useRouter();

  // Create and configure your Cloudinary instance.
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_cloud_name
    }
  });

  // app global store
  const { userData } = useAppStore((state) => ({
    userData: state.userData
  }));

  // getting all timesheets
  useEffect(() => {
    if (Object.keys(query).length > 0) {
      Object.keys(query)[0] == 'uuid'
        ? (async () => {
            const docRef = doc(getFirestore(), `timesheets`, query.uuid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              setTimesheet(docSnap.data());
              setIsLoading(false);
            } else {
              console.log('No such document!');
              setTimesheet('');
            }
          })()
        : push('/');
    }
  }, [query]);

  // deleting timesheet
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteDoc(doc(getFirestore(), `timesheets`, query.uuid));

      push(`/timesheets`);
      setIsDeleting(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout titleFromChild="Timesheet">
      {isLoading === true ? (
        <p className="p-48 text-center">Fetching timesheet...</p>
      ) : isDeleting === true ? (
        <p className="p-48 text-center">Deleting timesheet...</p>
      ) : (
        <>
          <div className="flex justify-between w-11/12 sm:pl-8 pr-4 mx-auto mt-8 sm:mt-5">
            <div className="w-full">
              <p className="sm:text-xl">Time tracking - {timesheet?.employee?.name || 'Task name'}</p>
              <div className="grid grid-cols-2 gap-y-6 w-full sm:flex sm:items-center mt-6 sm:mt-4">
                <div className=''>
                  <p className="text-sm bg-amrblue bg-opacity-25 px-2 py-1 w-20 rounded-md">{timesheet?.employee?.departmentName || 'Name'}</p>
                </div>
                <p className="text-sm ml-1.5 sm:ml-10">{timesheet?.date || 'Timesheet date'}</p>
                <p className="text-sm ml-1.5 sm:ml-10">
                  {`${convert(timesheet?.totalTime).hours}hr ${convert(timesheet?.totalTime).minutes}m ${convert(timesheet?.totalTime).seconds}s`}
                </p>
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

          <p className="w-11/12 mx-auto sm:pl-8 mt-8 sm:mt-14 text-lg font-medium">All screenshots</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-7 w-11/12 mx-auto sm:pl-8 pr-4 mt-8 sm:mt-10 screenshots">
            {timesheet?.screenshots?.map((screenshot, index) => (
              <AdvancedImage
                cldImg={cld.image(screenshot?.takenScreenshot?.public_id).resize(thumbnail())}
                key={index}
                onClick={() => {
                  setIsOpen(true);
                  setImageId(screenshot?.takenScreenshot?.public_id);
                }}
              />
            ))}
          </div>
        </>
      )}
      {!!isOpen && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
            <TransitionChild>
              <div className="fixed inset-0 bg-black bg-opacity-90" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4 text-center">
              <TransitionChild>
                <Dialog.Panel className="w-11/12 h-screen grid place-content-center relative">
                  <AdvancedImage cldImg={cld.image(imageId).resize(thumbnail())} />
                  <XMarkIcon
                    className="h-7 w-7 stroke-white fixed right-5 top-5 cursor-pointer"
                    onClick={() => {
                      setIsOpen(false);
                      setImageId('');
                    }}
                  />
                </Dialog.Panel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>
      )}
    </Layout>
  );
};

export default Tasks;
