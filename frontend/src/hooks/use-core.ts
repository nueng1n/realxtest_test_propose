import { useContext } from 'react';
import CoreContext from '../context/core';

function useCore() {
  return useContext(CoreContext) 
}

export default useCore;
