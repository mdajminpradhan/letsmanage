import { Fragment, useLayoutEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import TransitionChild from 'components/common/TransitionChild';
import { encryptData } from '@/utils/encryptDecrypt';
import Copy from '../SVGIcons/Copy';
import copy from 'copy-to-clipboard';
import { CheckIcon } from '@heroicons/react/20/solid';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

const CopyInvite = ({ isOpen, setIsOpen }) => {
  const [invitationLink, setinvitationLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [encrypted, setEncrypted] = useState('');

  useLayoutEffect(() => {
    const encryptedKey = encryptData('invite');
    const link = `${process.env.NEXT_PUBLIC_CONNECTION_TYPE}://${process.env.NEXT_PUBLIC_DOMAIN_NAME}/invite?secret=${encryptedKey}`;
    setEncrypted(encryptedKey);
    setinvitationLink(link);
  }, []);

  // create a new space
  const saveInvitationToFirebase = async (link) => {
    try {
      await addDoc(collection(getFirestore(), 'invitations'), { key: link });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setIsOpen(false);
          setCopied(false);
        }}
      >
        <TransitionChild>
          <div className="fixed inset-0 -top-48 bg-black bg-opacity-70" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild>
              <Dialog.Panel className="w-full max-w-lg bg-gray-900  transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all relative -top-48">
                <Dialog.Title as="h3" className="flex justify-between items-center text-lg font-medium leading-6">
                  Copy invitation link
                  <XMarkIcon
                    className="h-5 w-5 text-white cursor-pointer"
                    onClick={() => {
                      setIsOpen(false);
                      setCopied(false);
                    }}
                  />
                </Dialog.Title>
                <div className="mt-8">
                  <p className="text-white mb-2.5 block">Invitation link</p>

                  <div className="flex items-center">
                    <p
                      type="text"
                      className="text-sm px-4 py-2 rounded-l-lg border-l border-t border-b border-white border-opacity-30 text-white focus:ring-0 outline-none ring-blue-400 w-full bg-transparent"
                    >
                      {invitationLink.substring(0, 50) + '...'}
                    </p>
                    <div
                      className="bg-primary py-2.5 px-2.5 rounded-r-lg cursor-pointer hover:bg-amrblue"
                      onClick={() => {
                        copy(invitationLink);
                        setCopied(true);
                        saveInvitationToFirebase(encrypted);
                      }}
                    >
                      {!!copied ? <CheckIcon className="h-[18px] w-[18px] text-white" /> : <Copy />}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CopyInvite;
