import create from 'zustand';

const useAppStore = create((set) => ({
  isCreateSpaceOpen: false,
  setIsCreateSpaceOpen: (val) => {
    set(() => ({
      isCreateSpaceOpen: val
    }));
  },
  isCreateTaskOpen: false,
  setIsCreateTaskOpen: (val) => {
    set(() => ({
      isCreateTaskOpen: val
    }));
  },
  spaces: [],
  setSpaces: (val) => {
    set(() => ({
      spaces: val
    }));
  },
  users: [],
  setUsers: (val) => {
    set(() => ({
      users: val
    }));
  },
  userData: [],
  setUserData: (val) => {
    set(() => ({
      userData: val
    }));
  }
}));

export default useAppStore;
