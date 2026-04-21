let lastPath = "/";

export const setLastPath = (path: string) => {
  lastPath = path;
};

export const getLastPath = () => lastPath;