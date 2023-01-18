import { memo, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

const WithAuthentication = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // router
  const { pathname, push } = useRouter();

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (!user) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    });
  }, []);

  if (isAuthenticated === false) {
    if (pathname === '/login') {
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
    if (pathname === '/login' || pathname === '/createaccount') {
      push('/');
    } else {
      return children;
    }
  }
};

export default memo(WithAuthentication);
