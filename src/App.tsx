import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';

import { RootState as CustomRootState } from './store/rootReducer';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import Registration from './pages/auth/Registration';
import Login from './pages/auth/Login';
import Game from './pages/Game';
import Admin from './pages/Admin/Admin';

import NotFound from './pages/NotFound';
import TestPage from './pages/TestPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import Verify from './pages/Verify';
import RecoveryPassword from './pages/RecoveryPassword';

const App = () => {
	const { isAuth, account } = useSelector(
		(state: CustomRootState) => state.app,
	);

	return (
		<div>
			<Router>
				<Routes>
					{(!isAuth && (
						<>
							<Route path='/' element={<Navigate to='/login' />}></Route>
							<Route
								path='/forgot_password'
								element={<ForgotPassword />}></Route>
							<Route
								path='/recovery_password'
								element={<RecoveryPassword />}></Route>
							<Route path='/registration' element={<Registration />}></Route>
							<Route path='/login' element={<Login />}></Route>
						</>
					)) || (
						<>
							<Route path='/' element={<Home />}></Route>
							<Route path='/registration' element={<Navigate to='/' />}></Route>
							<Route path='/login' element={<Navigate to='/' />}></Route>
							<Route path='/game/:id' element={<Game />}></Route>
							<Route path='/verify_email' element={<Verify />}></Route>

							{(account.is_admin || account.is_super_admin) && (
								<Route path='/admin' element={<Admin />}></Route>
							)}

							<Route path='/test' element={<TestPage />}></Route>
						</>
					)}
					<Route path='*' element={<NotFound />}></Route>
				</Routes>
			</Router>
		</div>
	);
};

export default App;
