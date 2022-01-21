import './Navbar.scss';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../redux/store';
import { Button } from '@material-ui/core';

export default function Navbar() {
    const dispatch = useDispatch();
    const handleLogOut = () => {
        dispatch(authActions.logout());
    }

  return(
    <div className='navbar-container'>
        <div className='container'>
            <div className='nav-box'>
                <div className='nav-title'>
                    <h3>Todo-App</h3>
                </div>
                <Button onClick={handleLogOut} variant='outlined' style={{
                }}>Log Out</Button>
            </div>
        </div>
    </div>
  )
}
