import { memo, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import useAppStore from '@/appStore';

const WithAuthentication = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isUserVerified, setIsUserVerified] = useState(null);

  // router
  const { pathname, push } = useRouter();

  // app global store
  const { userData, setUserData } = useAppStore((state) => ({
    userData: state.userData,
    setUserData: state.setUserData
  }));

  useEffect(() => {
    onAuthStateChanged(getAuth(), async (user) => {
      if (!user) {
        setIsAuthenticated(false);
      } else {
        try {
          const docRef = doc(getFirestore(), 'users', user.uid);
          const snap = await getDoc(docRef);

          const record = snap?.data();
          record.id = snap?.id;

          setUserData(record);
          setIsAuthenticated(true);
          setIsUserVerified(user.emailVerified);
        } catch (error) {
          console.log(error);
        }
      }
    });
  }, []);

  // allowed pages
  const onlyForLoggedInUser = ['/', '/tasks', '/tasks/[uuid]', '/timesheets', '/timesheets/[uuid]'];
  const onlyForLoggedInTeamLeaders = ['/', '/tasks', '/tasks/[uuid]', '/timesheets', '/timesheets/[uuid]'];
  const onlyForLoggedOutUser = ['/createaccount', '/login', '/reset', '/invite'];

  if (isAuthenticated === false) {
    if (pathname === '/login' || pathname === '/createaccount' || pathname === '/reset' || pathname === '/invite') {
      return children;
    } else {
      push('/login');
    }
  }

  if (isAuthenticated == null) {
    return (
      <div className="flex justify-center items-center bg-silent bg-no-repeat bg-cover h-screen">
        <p>Checking your authentication... 🙌</p>
      </div>
    );
  }

  // new login
  if (!!isAuthenticated && !!isUserVerified && userData?.status === 'approved') {
    if (userData?.role === 'Admin') {
      if (onlyForLoggedOutUser.includes(pathname) === true) {
        push('/');
      } else if (pathname === '/request') {
        push('/');
      } else {
        return children;
      }
    } else if (userData?.role === 'Team Leader') {
      if (onlyForLoggedInTeamLeaders.includes(pathname) === true) {
        return children;
      } else {
        push('/');
      }
    } else if (userData?.role === 'User') {
      if (onlyForLoggedInUser.includes(pathname) === true) {
        return children;
      } else {
        push('/');
      }
    }
  } else if (!!isAuthenticated && !!isUserVerified && userData?.status === 'joined') {
    if (pathname === '/request') {
      return children;
    } else {
      push('/request');
    }
  } else if (!!isAuthenticated && !!isUserVerified && userData?.status === 'pending') {
    if (pathname === '/request') {
      return children;
    } else {
      push('/request');
    }
  } else if (!!isAuthenticated && isUserVerified === false) {
    if (pathname === '/login') {
      return children;
    } else {
      push('/login');
    }
  } else {
    return (
      <section className={`h-screen overflow-hidden bg-silent bg-no-repeat bg-cover grid place-content-center`}>
        <p>Something went wrong...</p>
      </section>
    );
  }
};

export default memo(WithAuthentication);
