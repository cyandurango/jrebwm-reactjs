import React from 'react';
import { FiLock } from "react-icons/fi";

const PasswordInput = ({ setPassword }) => {
  return (
    <div className="Password-Box">
        {/* <div className="Icontainer">
          <span className="User_Icon">
            <FaUser/>
          </span>
        </div> */}
      <div className="OuterContainer">
        <div className="UsernameContainer">
          <input
          placeholder=""
          type="password"
          onChange={(e) => setEmail(e.target.value)}required
          />
          <label for="Username">PASSWORD</label>
        </div>
        
        
      </div>
    </div>
  );
};

export default PasswordInput;