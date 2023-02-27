require('firebase.config');
import useAppStore from '@/appStore';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import 'styles/app.scss';
import 'styles/globals.scss';

const App = ({ Component, pageProps }) => {
  // app global store
  const { isCreateSpaceOpen, setIsCreateSpaceOpen, isCreateTaskOpen, setIsCreateTaskOpen, userData } = useAppStore((state) => ({
    isCreateSpaceOpen: state.isCreateSpaceOpen,
    setIsCreateSpaceOpen: state.setIsCreateSpaceOpen,
    isCreateTaskOpen: state.isCreateTaskOpen,
    setIsCreateTaskOpen: state.setIsCreateTaskOpen,
    userData: state.userData
  }));

  useEffect(() => {
    const createSpacePopUp = (event) => {
      if (userData?.role !== 'User') {
        if (event.altKey && event.keyCode === 67 && isCreateTaskOpen === false && userData?.role === 'Admin') {
          setIsCreateSpaceOpen(true);
        } else if (event.altKey && event.keyCode === 84 && isCreateSpaceOpen === false) {
          setIsCreateTaskOpen(true);
        }
      }
    };
    window.addEventListener('keydown', createSpacePopUp);

    return () => {
      window.removeEventListener('keydown', createSpacePopUp);
    };
  }, [isCreateSpaceOpen, isCreateTaskOpen]);

  return (
    <>
      <Component {...pageProps} />
      <Toaster position="bottom-left" reverseOrder={false} />
    </>
  );
};

export default App;
