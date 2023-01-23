import Layout from '@/components/common/Layout';
import useAppStore from '@/appStore';
import ShowAllTasksByAllUsers from '@/components/dashboard/ShowAllTasksByAllUsers';
import ShowTasksByMyId from '@/components/dashboard/ShowTasksByMyId';

const Tasks = () => {
  // app global store
  const { userData } = useAppStore((state) => ({
    userData: state.userData
  }));

  return (
    <Layout>
      {userData?.role === 'Admin' || userData?.role === 'Editor' ? (
        <ShowAllTasksByAllUsers />
      ) : userData?.role === 'User' ? (
        <ShowTasksByMyId />
      ) : null}
    </Layout>
  );
};

export default Tasks;
