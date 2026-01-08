import {BrowserRouter, Route, Routes} from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import LandingPage from './pages/public/LandingPage';
import AuthPage from './pages/public/AuthPage';
import PublicLayout from './layouts/PublicLayout';

function App(){
  return (
    <BrowserRouter>
        <Routes>


        {/* Public */}
        <Route element = {<PublicLayout />}>
          <Route index element = {<LandingPage />} />
          <Route path='/auth' element = {<AuthPage />}/>
        </Route>

        {/* Admin */}       
        <Route element = {<AdminLayout />}>
        </Route>


        </Routes>
    </BrowserRouter>
  );
}

export default App;