require('firebase.config');
import 'styles/globals.scss';
import 'styles/app.scss';
import { useEffect } from 'react';
import useAppStore from '@/appStore';
import { Toaster } from 'react-hot-toast';

const App = ({ Component, pageProps }) => {
  // app global store
  const { isCreateSpaceOpen, setIsCreateSpaceOpen, isCreateTaskOpen, setIsCreateTaskOpen } = useAppStore((state) => ({
    isCreateSpaceOpen: state.isCreateSpaceOpen,
    setIsCreateSpaceOpen: state.setIsCreateSpaceOpen,
    isCreateTaskOpen: state.isCreateTaskOpen,
    setIsCreateTaskOpen: state.setIsCreateTaskOpen
  }));

  useEffect(() => {
    const createSpacePopUp = (event) => {
      if (event.keyCode === 67 && isCreateTaskOpen === false) {
        setIsCreateSpaceOpen(true);
      } else if (event.keyCode === 84 && isCreateSpaceOpen === false) {
        setIsCreateTaskOpen(true);
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
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default App;
