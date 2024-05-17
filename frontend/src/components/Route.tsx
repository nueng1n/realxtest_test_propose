import useNavigation from '../hooks/use-navigation';
import {RouteProps, NavigationContextType} from '../interface/route'


function Route({ path, children }: RouteProps) {
  const { currentPath } = useNavigation() as NavigationContextType ;

  if (path === currentPath) {
    return <>{children}</>;
  }

  return null;
}

export default Route;
 