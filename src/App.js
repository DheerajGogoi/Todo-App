import "./styles.css";
import { useQuery } from "@apollo/client";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import TodoInput from "./components/TodoInput";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";


export default function App() {
  const { isLoggedIn } = useSelector(state => state.auth);
  
  return (
    <Router>
      <Switch>
        {
          isLoggedIn ?
          <>
            <Route path='/home' component={Home} exact />
            <Route path='*'>
              <Redirect to='/home' />
            </Route>
          </>:
          <>
            <Route path='/login' component={Login} exact />
            <Route path='*'>
              <Redirect to='/login' />
            </Route>
          </>
        }
      </Switch>
    </Router>
  );
}
