
import React from 'react';
import { FaUser } from "react-icons/fa";

const UsernameInput = ({setEmail}) => {
  return (
    <div className="Username-Box">
        {/* <div className="Icontainer">
          <span className="User_Icon">
            <FaUser/>
          </span>
        </div> */}
      <div className="OuterContainer">
        <div className="UsernameContainer">
          <input
          placeholder=""
          type="text"
          onChange={(e) => setEmail(e.target.value)}required
          />
          <label for="Username">USERNAME</label>
        </div>
        
        
      </div>
    </div>
  );
};

export default UsernameInput;
