import { Dialog, Transition } from '@headlessui/react';
import TransitionChild from './TransitionChild';
import { Fragment } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

const ShortcusOpen = ({ isOpen, setIsOpen }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
        <TransitionChild>
          <div className="fixed inset-0 bg-black bg-opacity-90" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4 text-center">
          <TransitionChild>
            <Dialog.Panel className="w-[800px] h-[550px] bg-amrblue bg-opacity-20 transform rounded-lg p-10 text-left align-middle shadow-xl transition-all">
              <div className="grid grid-cols-3">
                <p>Create Space - C</p>
                <p>Create Task - T</p>
              </div>
            </Dialog.Panel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ShortcusOpen;
