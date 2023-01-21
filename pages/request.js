import { useState } from 'react';
import Image from 'next/image';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import WithAuthentication from '@/utils/WithAuthentication';
import useAppStore from '@/appStore';

const Request = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // app global store
  const { userData } = useAppStore((state) => ({
    userData: state.userData
  }));

  const requestAccess = async () => {
    setIsLoading(true);

    try {
      await updateDoc(doc(getFirestore(), 'users', userData.id), { status: 'pending' });

      setIsSuccess(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <WithAuthentication>
      <div className="grid place-content-center bg-silent bg-no-repeat bg-cover h-screen w-screen">
        <div>
          <div className="h-28 w-28 mx-auto mb-4 rounded-full relative">
            <Image src="/assets/icons/lock.png" alt="Picture of the author" fill />
          </div>
          <p className="text-xl w-96 text-center">You need to get approval before you manage your tasks</p>

          {isSuccess === true ? (
            <div className="flex justify-center w-full mt-10">
              <button type="button" className="bg-primary hover:bg-hoverPrimary px-4 py-2 w-full font-medium rounded-xl text-white">
                Requested
              </button>
            </div>
          ) : (
            <div className="flex justify-center w-96 mx-auto mt-10">
              <button
                type="button"
                className="bg-hoverPrimary transform hover:scale-95 transition-all duration-300 px-4 py-2 w-full font-medium rounded-xl text-white"
                onClick={requestAccess}
              >
                {isLoading === true ? 'Requesting...' : 'Request for Access'}
              </button>
            </div>
          )}
        </div>
      </div>
      );
    </WithAuthentication>
  );
};

export default Request;
