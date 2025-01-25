import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, theme } from 'antd';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Option1Page from './option1Page'; // Option1 컴포넌트
import Option2Page from './option2Page'; // Option2 컴포넌트

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Home', '1', <PieChartOutlined />),
  getItem('ServerSetting', '2', <DesktopOutlined />),
  getItem('Client', 'sub1', <UserOutlined />, [
    getItem('SingIn', '3'),
    getItem('SingUp', '4'),
    getItem('match', '5'),
  ]),
  getItem('Monitoring', 'sub2', <TeamOutlined />, [
    getItem('User', '6'), 
    getItem('Game', '7'),
  ]),
  getItem('Files', '8', <FileOutlined />),
];

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedPage, setSelectedPage] = useState('1'); // 현재 선택된 페이지 상태 관리
  const [breadcrumbItems, setBreadcrumbItems] = useState(['Home']); // Breadcrumb 상태 관리

  // theme.useToken() 훅을 통해 색상 정보 받아오기
  // theme.useToken() 훅을 통해 색상 정보 받아오기
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleMenuClick = (e) => {
    setSelectedPage(e.key); // 메뉴 클릭 시 상태 변경
    updateBreadcrumb(e.key); // Breadcrumb 경로 업데이트
  };

  // 네비게이션
  const updateBreadcrumb = (key) => {
    let items = ['Home']; // 기본 홈 페이지 경로

    // 각 메뉴 항목에 맞는 경로 추가
    if (key === '1') {
      items.push('');
    } else if (key === '2') {
      items.push('ServerSetting');
    } else if (key === '3') {
      items.push('Client', 'SingIn'); // 톰을 선택한 경우
    } else if (key === '4') {
      items.push('Client', 'SingUp'); // 빌을 선택한 경우
    } else if (key === '5') {
      items.push('Client', 'match'); // 알렉스를 선택한 경우
    } else if (key === '6') {
      items.push('Monitoring', 'User'); // 팀 1을 선택한 경우
    } else if (key === '7') {
      items.push('Monitoring', 'Game'); // 팀 2를 선택한 경우
    }

    setBreadcrumbItems(items); // 갱신된 항목으로 브레드크럼 업데이트
  };

  const renderContent = () => {
    switch (selectedPage) {
      case '1':
        return <Option1Page />;
      case '2':
        return <Option2Page />;
      default:
        return <h1>Select an Option</h1>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={handleMenuClick}>
          <Menu.Item key="1">Home</Menu.Item>
          <Menu.Item key="2">ServerSetting</Menu.Item>
          <Menu.SubMenu key="sub1" icon={<UserOutlined />} title="Client">
            <Menu.Item key="3">SingIn</Menu.Item>
            <Menu.Item key="4">SingUp</Menu.Item>
            <Menu.Item key="5">match</Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="sub2" icon={<TeamOutlined />} title="Monitoring">
            <Menu.Item key="6">User</Menu.Item>
            <Menu.Item key="7">Game</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="8" icon={<FileOutlined />}>
            Files
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            textAlign: 'center',
            fontSize: '24px', // 크기 조정
            fontWeight: 'bold', // 글씨 두껍게
          }}
        >
          CH 5 타워 디펜스 게임 리마스터 프로젝트 - 서버테스트
        </Header>
        <Content style={{ margin: '0 16px' }}>
          {/* Breadcrumb을 상단에 위치시키기 */}
          <Breadcrumb style={{ margin: '16px 0' }}>
            {breadcrumbItems.map((item) => (
              <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: '#fff',
            }}
          >
            {/* 선택된 메뉴에 따라 콘텐츠 변경 */}
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Home;
