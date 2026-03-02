//CSS IMPORTS
import "./AuthPageDesign.css";

//FUNCTION IMPORTS
import React, { useState } from 'react';
import { auth } from '../../../config/firebase.jsx';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import FooterBar from '../GeneralPageComponents/FooterBar.jsx';
import UsernameInput from './UsernameInputBox.jsx';
import PasswordInput from './PasswordInputBox.jsx';

//=================================================================================================
//  FUNCTION NAME    :   AuthenticationPage
//  DESCRIPTION      :   Creates the Authentication Page
//=================================================================================================
const AuthenticationPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate();

  async function Login() {
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(data => {
        history('/product_database');
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="AuthenticationPages">
      <FooterBar />
      <div className="WidthFlexContainer">
        <div className="ImaginaryWidth"></div>
        <div className="HeightFlexContainer">
          <div className="ImaginaryHeight"></div>
          <div className="LoginContainer">
            
            <div className="LoginContentContainer">
              <div className="LogoContainer">
                
                    <img className="LogoIcon" src = "src/assets/icons/inventory-sys-icon.png" alt="inventory icon" />
                    <div className="Title-Box">
                     <div className="BigTitle">JERANGO</div>  
                     <div className="SubTitle">WAREHOUSE MANAGER</div>
                    </div>
                    
              </div>

              {/* LOGIN SECTION OF THE AUTHENTICATION BOX */}
              <div className="LoginContentBox">
                <div className="PageTitle">
                  <div className="PageTitleBox">LOGIN</div>
                </div>

                <div className="InputContainer">
                  
                  <div></div>
                  {/* LOGIN | USERNAME SECTION OF THE AUTHENTICATION BOX */}
                  <UsernameInput setEmail={setEmail} />
                  <div></div>

                  <div></div>
                  {/* LOGIN | PASSWORD SECTION OF THE AUTHENTICATION BOX */}
                  <PasswordInput setPassword={setPassword} />
                  <div></div>

                </div>

                <div className="EnterContainer">
                  <button onClick={Login} className="EnterButton">ENTER</button>
                </div>
              </div>
            </div>
          </div>
          <div className="ImaginaryHeight"></div>
        </div>
        <div className="ImaginaryWidth"></div>
      </div>
    </div>
  );
};

export default AuthenticationPage;