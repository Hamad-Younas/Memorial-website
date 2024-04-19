import './App.css';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/home/home';
import Login from './pages/login/login';
import Register from './pages/register/register';
import Forget from './pages/forget/forget';
import Confirm from './pages/confirm-code/confirm';
import ConfirmPassword from './pages/change-password/change';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/user" component={Forget} />
        <Route path="/confirm-code" component={Confirm} />
        <Route path="/confirm-pass" component={ConfirmPassword} />
      </Switch>
    </div>
  );
}

export default App;
