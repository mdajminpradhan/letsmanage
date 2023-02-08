import Layout from '@/components/common/Layout';
import useAppStore from '@/appStore';
import ShowAllTimesheetsByAllUsers from '@/components/dashboard/ShowAllTimesheetsByAllUsers';
import ShowTimesheetsByMyId from '@/components/dashboard/ShowTimesheetsByMyId';

const Timesheets = () => {
  // app global store
  const { userData } = useAppStore((state) => ({
    userData: state.userData
  }));

  return (
    <Layout titleFromChild='Timesheets'>
      {userData?.role === 'Admin' || userData?.role === 'Team Leader' ? (
        <ShowAllTimesheetsByAllUsers />
      ) : userData?.role === 'User' ? (
        <ShowTimesheetsByMyId />
      ) : null}
    </Layout>
  );
};

export default Timesheets;
