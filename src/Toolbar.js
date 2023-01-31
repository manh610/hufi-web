import React from 'react'
import { Menu } from 'antd';
import { ShopOutlined, ShoppingCartOutlined, ProfileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { SubMenu } = Menu;

const rootSubmenuKeys = ['sub1'];

const Toolbar = () => {

  const [openKeys, setOpenKeys] = React.useState(['sub1']);

  const navigate = useNavigate();

  const onOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

    return (
      <div >
        <Menu mode="inline" openKeys={openKeys} onOpenChange={onOpenChange} style={{ width: 256 }}>
          <SubMenu key="sub1" title="Menu">
            <Menu.Item icon={<ShopOutlined />} key="1" onClick={() => navigate("/shop")} >Shop</Menu.Item>
            <Menu.Item icon={<ShoppingCartOutlined />} key="2" onClick={() => navigate("/cart")}>Cart</Menu.Item>
            <Menu.Item icon={<ProfileOutlined />} key="3" onClick={() => navigate("/profile")}>Profile</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    )
}

export default Toolbar;
  