import {BrowserRouter, Route, Routes} from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';

import LandingPage from './pages/public/LandingPage';
import AuthPage from './pages/public/AuthPage';

import Dashboard from './pages/admin/Dashboard';
import HotelPage from './pages/admin/HotelPage';
import OrderPage from './pages/admin/OrderPage';
import MenuPage from './pages/admin/MenuPage';
import QrcodePage from './pages/admin/QrcodePage';


function App(){
  return (
    <BrowserRouter>
        <Routes>


          {/* Public */}
          <Route element = {<PublicLayout />}>
            <Route index element = {<LandingPage />} />
            <Route path='/auth' element = {<AuthPage />}/>
          </Route>

          {/* Admin Protected*/}       
          <Route element = {<AdminLayout />} >
            <Route path='/admin'>
              <Route index element = { <Dashboard/> } />
              <Route path='/admin/hotel' element = { <HotelPage/> } />
              <Route path='/admin/orders' element = { <OrderPage/> }/>
              <Route path='/admin/menu' element = {<MenuPage/>} />
              <Route path='/admin/qrcode' element = { <QrcodePage/>}/>
            </Route>
          </Route>


        </Routes>
    </BrowserRouter>
  );
}

export default App;