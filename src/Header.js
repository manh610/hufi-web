import React, { Component } from 'react'
import { Row, Col } from 'antd';
import { Image } from 'antd';
import 'antd/dist/antd.css'; 
import './Header.css'

const style = {
  height: '119px',
  top: '0 px',
  background: '#C6E5F4',
  left: '0 px',
  display : 'flex'
}     

const a = {
  width: '98px',
  height: '86px',
  marginLeft: '37px',
  paddingTop: '10px',
  paddingBottom : '23px'
}

const ava = {
  width: '69px',
  height: '69px',
  paddingTop: '27px',
  float : 'right'
}

const b = {
    position: 'absolute', 
    width: '505px',
    height: '66px',
    top: '30px',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight : '400',
    fontSize: '48px',
    lineHeight: '56px',
    alignItems: 'center'
}

export default class Header extends Component {
  render() {
    return (
      <Row style={style} >
        <Col style={a} span={3}>
          <Image width={98} height={86} preview={false} src= '/image/Logo 1.png'/>
        </Col>
        <Col span={18}>
          <p style={b}> Mobile Shopping </p>  
        </Col>
        <Col style={ava} span={2}>
          <Image height={69} width={69} preview={false} src='/image/avatar.png'/>  
        </Col>
      </Row>
    )
  }
}
