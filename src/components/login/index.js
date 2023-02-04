import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Image, Form, Input, Button, Checkbox, Row, Col } from 'antd';
import './style.css'
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { userService } from '../../service/user';


const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    toast.configure();

    const checkLogin = async () => {
        console.log(username)
        console.log(password)
        let response;
        let code = 222;
        await axios.post(`http://localhost:2002/teachers/login`, {
            username: username,
            password: password
        }).then( res => {
                response = res.data;
                code = 200
            })
            .catch(error => {
                code = 404
            });
        console.log(code)
        if (code == 200 ) {
            notify('success');
            const user = response.data;
            userService.set(user);
            navigate('/manage')
        } else {
            notify("fail");
        }
        return response;
    }


    const notify = (info) => {
        switch(info) {
            case 'success':
                toast.success('Login success');
                break;
            case 'fail' :
                toast.error('username or password incorrect');
                break;
            default:
                
        }
    }

    const login = () => {
        navigate('/manage')
        // checkLogin()
    }

    return ( 
        <div className = 'all'> 
            < div className = 'header' >
                <Image className = 'logo' src = 'image/sv_header_login.png' preview = {false} />
            </div> 
            <Row className='content'>
                <Col span={18}></Col>
                <Col span={6} className='form'>
                    <div className='a'>
                        <Row>
                            <h3 className='title-a'>QUẢN LÍ ĐIỂM DANH SINH VIÊN</h3>
                        </Row>
                        <Row>
                            <p className='title-b'>ĐĂNG NHẬP HỆ THỐNG</p>
                        </Row>
                        <Input onChange={(e) => setUsername(e.target.value)} className='input-username' placeholder="Nhập tên tài khoản" />
                        <Input onChange={(e) => setPassword(e.target.value)} className='input-pass' placeholder="Nhập mật khẩu" type='password' />
                        <div className='btn-login' onClick={() => login()}>
                            <p className='text-btn'>ĐĂNG NHẬP</p>
                        </div>
                    </div>
                </Col>
            </Row>
            
        </div>
    );
}

export default Login;