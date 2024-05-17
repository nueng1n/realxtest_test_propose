import LoginPage from "./pages/LoginPage"
import Route from './components/Route';
import PostPage from "./pages/PostPage";

function App() {

  return (
    <div className="m-4">


      <Route path="/">
        <LoginPage></LoginPage>
      </Route>
      <Route path="/post">
        <PostPage></PostPage>
      </Route>

  
  

    </div>
  )
}

export default App
