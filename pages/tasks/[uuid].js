import Layout from '@/components/common/Layout';
import { CheckIcon, ChevronUpDownIcon, EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import { FlagIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { Menu } from '@headlessui/react';
import MenuTransition from '@/components/common/MenuTransition';
import { Transition, Listbox } from '@headlessui/react';
import { Fragment, useState } from 'react';

const status = [{ title: 'To Do' }, { title: 'In Progress' }, { title: 'Complete' }];

const Tasks = () => {
  const subTasks = Array.from(Array(7).keys());
  const [selected, setSelected] = useState('');

  return (
    <Layout title="Frontend">
      <div className="flex justify-between w-11/12 pl-8 p4-4 mx-auto mt-5">
        <div>
          <p className="text-xl">learn task management on team management new platform...</p>
          <div className="flex items-center mt-4">
            <Listbox value={selected} onChange={setSelected}>
              <div className="relative ml-2">
                <Listbox.Button className="relative w-full cursor-pointer rounded-full border border-white border-opacity-10 text-xs px-2 py-1.5 pr-8 focus:outline-none focus:ring-0">
                  <span className="bg-amrblue bg-opacity-25 rounded-full px-4 py-1 text-sm inline-block">{selected.title}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <Listbox.Options className="absolute mt-1 max-h-60 w-48 overflow-y-scroll rounded-md bg-gray-900 py-1 shadow-lg ring-0 focus:outline-none sm:text-sm">
                    {status.map((item, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-gray-900' : ''}`}
                        value={item}
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{item.title}</span>
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

            <FlagIcon className="h-5 w-5 fill-third ml-10" />
            <p className="text-sm ml-10">23rd May, 2023</p>

            <div className="h-9 w-9 ml-10 rounded-full relative top-[1px]">
              <Image src="/assets/images/avatar.png" alt="Picture of the author" fill />
            </div>
          </div>
        </div>

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="text-white outline-none focus:ring-0">
              <EllipsisHorizontalIcon className="h-8 w-8" />
            </Menu.Button>
          </div>
          <MenuTransition>
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-rightrounded-md shadow-lg bg-amrblue bg-opacity-25 rounded-lg focus:ring-0 focus:outline-none">
              <div className="flex items-center px-2 py-2 cursor-pointer">
                <Menu.Item>
                  <>
                    <TrashIcon className="h-6 w-6 stroke-red-400" />
                    <span className="ml-2">Delete</span>
                  </>
                </Menu.Item>
              </div>
            </Menu.Items>
          </MenuTransition>
        </Menu>
      </div>

      <div className="max-w-[91%] mx-auto pl-8 pr-4 mt-6">
        <p className="leading-8">
          Lorem ipsum dolor sit amet consectetur. Pharetra placerat massa adipiscing mollis. Massa ullamcorper pharetra habitant bibendum justo. Nullam pulvinar vulputate integer
          magnis non. Fermentum velit posuere congue risus bibendum nunc in. Risus egestas lectus mattis diam venenatis feugiat leo interdum in. Volutpat amet ipsum rhoncus integer
          in adipiscing facilisis
        </p>

        {subTasks.length > 0 ? (
          <div className="mt-10">
            <p className="text-sm mt-4 text-gray-400 font-medium mb-4">Subtasks</p>
            {subTasks.map((item, index) => (
              <div className="flex items-center ml-8 mb-2" key={index}>
                <span className="bg-amrblue h-1.5 w-1.5 rounded-full block"></span>
                <p className="ml-4">Lorem ipsum dolor sit amet consectetur adipisicing</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default Tasks;
