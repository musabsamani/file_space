import React, { useState } from 'react';
import {
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBBtn,
    MDBInput,
} from 'mdb-react-ui-kit';
import { loginUser } from '../services/api';

const LoginForm = ({ onAuthSuccess }) => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let data = await loginUser(username, password);

            onAuthSuccess(data.token);
        } catch (err) {
            setError('Failed to authenticate');
        }
    };

    return (
        <MDBContainer fluid className="p-3 my-5">

            <MDBRow>

                <MDBCol col='10' md='6'>
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" class="img-fluid" alt="Phone image" />
                </MDBCol>

                <MDBCol col='4' md='6'>


                    <MDBInput value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} wrapperClass='mb-4' label='Enter Email or Username' id='formControlLg' type='string' size="lg" />
                    <MDBInput value={password} onChange={(e) => setPassword(e.target.value)} wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" />

                    <MDBBtn className="mb-4 w-100" size="lg">Sign in</MDBBtn>

                </MDBCol>

            </MDBRow>

        </MDBContainer>
    );
}


export default LoginForm;
