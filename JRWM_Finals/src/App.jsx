//IMPORT STATEMENTS HERE
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthenticationPage from './components/pages/AuthPageComponents/AuthPage';
import ProdDBPage  from "./components/pages/ProductDBPageComponents/ProdDBPage";
import OrderLog from "./components/pages/OrderLogPageComponents/OrderLogPage";
import ReportAnalysis from "./components/pages/IARPageComponents/IARPage";
import AddProduct from './components/pages/ProductDBPageComponents/ProdDBAddProduct';

//=================================================================================================
//  FUNCTION NAME	:	App
//  DESCRIPTION		:	A function that generates the Application
//=================================================================================================
function App() {
  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path = '/' element= {<AuthenticationPage/>} />
            <Route path = '/product_database' element= { <ProdDBPage /> } />
            <Route path = '/add-product' element = { <AddProduct /> }/>
            <Route path = '/order_log' element = { <OrderLog /> }/>
            <Route path = '/inventory_analysis' element = { <ReportAnalysis /> }/>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
