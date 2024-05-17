import { useContext } from 'react';
import NavigationContext from '../context/navigation.tsx';

function useNavigation() {
  return useContext(NavigationContext) 
}

export default useNavigation;
