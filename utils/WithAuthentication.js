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
        const docRef = doc(getFirestore(), 'users', user.uid);
        const snap = await getDoc(docRef);

        const record = snap.data();
        record.id = snap.id;

        setUserData(record);
        setIsAuthenticated(true);
        setIsUserVerified(user.emailVerified);
      }
    });
  }, []);

  if (isAuthenticated === false) {
    if (pathname === '/login' || pathname === '/createaccount' || pathname === '/reset') {
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

  if (isAuthenticated === true) {
    if (isUserVerified === true) {
      if (pathname === '/login' || pathname === '/createaccount' || pathname === '/invite') {
        push('/');
      } else {
        if (userData?.role !== 'User') {
          return children;
        } else {
          if (pathname === '/' || pathname === '/tasks' || pathname === '/tasks/[uuid]') {
            if (userData?.status === 'joined' && userData?.status === 'pending') {
              push('/request');
            } else {
              return children;
            }
            return children;
          } else if (pathname === '/request') {
            if (userData?.status === 'joined' && userData?.status === 'pending') {
              return children;
            } else {
              push('/');
            }
          } else {
            push('/');
          }
        }
      }
    } else {
      if (pathname === '/login' || pathname === '/createaccount' || pathname === '/invite') {
        return children;
      } else {
        push('/login');
      }
    }
  }
};

export default memo(WithAuthentication);
