import Layout from '@/components/common/Layout';
import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { FlagIcon } from '@heroicons/react/24/solid';

const Home = () => {
  const items = Array.from(Array(5).keys());

  return (
    <Layout title="Dashboard">
      <div className="w-full px-8 pt-10">
        <div className="mx-auto w-full max-w-full rounded-2xl">
          <div className="mb-4 block">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring-0">
                    <ChevronRightIcon className={`${open ? 'rotate-90 transform' : ''} h-[22px] w-[22px] text-purple-500`} />
                    <span className="ml-2">Today</span>
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 pl-11">
                    {items.map((item, index) => (
                      <div className="flex justify-between items-center mb-5" key={index}>
                        <div className="flex items-center">
                          <span className="bg-secondary h-1.5 w-1.5 rounded-full block mr-2"></span>
                          <span>learn task managment by today</span>
                        </div>
                        <div className="flex items-center">
                          <FlagIcon className="h-5 w-5 fill-third" />
                          <p className="ml-8 mr-2">5 May, 2023</p>
                          <time>5:00 AM</time>
                        </div>
                      </div>
                    ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
          <div className="mb-4 block">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring-0">
                    <ChevronRightIcon className={`${open ? 'rotate-90 transform' : ''} h-[22px] w-[22px] text-purple-500`} />
                    <span className="ml-2">Overdue</span>
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 pl-11">
                    {items.map((item, index) => (
                      <div className="flex justify-between items-center mb-5" key={index}>
                        <div className="flex items-center">
                          <span className="bg-secondary h-1.5 w-1.5 rounded-full block mr-2"></span>
                          <span>learn task managment by today</span>
                        </div>
                        <div className="flex items-center">
                          <FlagIcon className="h-5 w-5 fill-third" />
                          <p className="ml-8 mr-2">5 May, 2023</p>
                          <time>5:00 AM</time>
                        </div>
                      </div>
                    ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
          <div className="mb-4 block">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring-0">
                    <ChevronRightIcon className={`${open ? 'rotate-90 transform' : ''} h-[22px] w-[22px] text-purple-500`} />
                    <span className="ml-2">Next</span>
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 pl-11">
                    {items.map((item, index) => (
                      <div className="flex justify-between items-center mb-5" key={index}>
                        <div className="flex items-center">
                          <span className="bg-secondary h-1.5 w-1.5 rounded-full block mr-2"></span>
                          <span>learn task managment by today</span>
                        </div>
                        <div className="flex items-center">
                          <FlagIcon className="h-5 w-5 fill-third" />
                          <p className="ml-8 mr-2">5 May, 2023</p>
                          <time>5:00 AM</time>
                        </div>
                      </div>
                    ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
          <div className="mb-4 block">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring-0">
                    <ChevronRightIcon className={`${open ? 'rotate-90 transform' : ''} h-[22px] w-[22px] text-purple-500`} />
                    <span className="ml-2">Unscheduled</span>
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 pl-11">
                    {items.map((item, index) => (
                      <div className="flex justify-between items-center mb-5" key={index}>
                        <div className="flex items-center">
                          <span className="bg-secondary h-1.5 w-1.5 rounded-full block mr-2"></span>
                          <span>learn task managment by today</span>
                        </div>
                        <div className="flex items-center">
                          <FlagIcon className="h-5 w-5 fill-third" />
                          <p className="ml-8 mr-2">5 May, 2023</p>
                          <time>5:00 AM</time>
                        </div>
                      </div>
                    ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
