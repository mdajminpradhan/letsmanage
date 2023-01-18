import Layout from '@/components/common/Layout';
import Image from 'next/image';

const Tasks = () => {
  const items = Array.from(Array(15).keys());

  return (
    <Layout title="Users">
      <div className="grid grid-cols-12 w-11/12 px-8 mx-auto mt-10">
        <p className="col-span-4">Email</p>
        <p className="col-span-2 text-center font-medium">Username</p>
        <p className="col-span-2 text-center font-medium">Status</p>
        <p className="col-span-2 text-center font-medium">Created at</p>
        <p className="col-span-2 text-center font-medium">Picture</p>
      </div>
      <div className="w-11/12 px-auto mx-auto bg-amrblue bg-opacity-10 mt-3 rounded-sm h-[550px] overflow-y-scroll scrollbar-thin">
        {items.map((item, index) => (
          <div className="grid grid-cols-12 items-center border-b border-white border-opacity-25 px-8 hover:bg-amrblue hover:bg-opacity-10 cursor-pointer" key={index}>
            <p className="col-span-4 py-3 border-r border-white border-opacity-25">ajmin@mymail.net</p>
            <p className="col-span-2 py-3 border-r border-white border-opacity-25 text-center text-sm">mdajminpradhan</p>
            <p className="col-span-2 py-3 border-r border-white border-opacity-25 text-center">
              <span className="bg-amrblue bg-opacity-25 rounded-full px-4 py-1 text-sm">Approved</span>
            </p>
            <p className="col-span-2 py-3 border-r border-white border-opacity-25 text-center text-sm">23rd May, 2023</p>
            <div className="col-span-2">
              <div className="h-10 w-10 mx-auto rounded-full relative top-[2px]">
                <Image src="/assets/images/avatar.png" alt="Picture of the author" fill />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Tasks;
