import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import TransitionChild from 'components/common/TransitionChild';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { XMarkIcon } from '@heroicons/react/24/solid';

const schema = yup
  .object()
  .shape({
    name: yup.string().required()
  })
  .required();
const CreateSpace = ({ isOpen, setIsOpen }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(schema)
  });

  // create a new space
  const createSpace = async (formdata) => {
    setIsLoading(true);

    // extend
    formdata.createdAt = Math.floor(Date.now() / 1000);

    try {
      await addDoc(collection(getFirestore(), 'spaces'), formdata);

      setIsOpen(false);
      setIsLoading(false);
      reset();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const watchAll = watch();

  useEffect(() => {
    // console.log(errors, watchAll);
  }, [errors, watchAll]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
        <TransitionChild>
          <div className="fixed inset-0 -top-48 bg-black bg-opacity-70" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild>
              <Dialog.Panel className="w-full max-w-lg bg-gray-900  transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all relative -top-48">
                <Dialog.Title as="h3" className="flex justify-between items-center text-lg font-medium leading-6">
                  Create a space
                  <XMarkIcon className="h-5 w-5 text-white cursor-pointer" onClick={() => setIsOpen(false)} />
                </Dialog.Title>
                <form onSubmit={handleSubmit(createSpace)}>
                  <div className="mt-8">
                    <label htmlFor="title" className="text-white mb-1.5 block">
                      Space title
                    </label>
                    <input
                      type="text"
                      className="text-sm px-4 py-2 rounded-lg border border-white border-opacity-30 text-white focus:ring-0 outline-none ring-blue-400 w-full bg-transparent"
                      id="title"
                      min={1}
                      max={20}
                      required
                      placeholder="Enter space title"
                      {...register('name')}
                    />
                  </div>

                  <div className="flex justify-center w-full mt-6">
                    <button type={isLoading === true ? 'button' : 'submit'} className="bg-primary hover:bg-hoverPrimary px-4 py-2 w-full font-medium rounded-xl text-white focus:ring-0 outline-none">
                      {isLoading === true ? 'Creating...' : 'Create space'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateSpace;
