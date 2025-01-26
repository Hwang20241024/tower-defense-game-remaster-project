import React from 'react';
import { Button, Form, Input } from 'antd'; // Ant Design에서 제공하는 컴포넌트들 임포트
import { serverSettingButtonHandler } from '../script/handlers/react/serverSettingButton.handler.js';

// MyFormItemContext를 이용해 중첩된 폼 아이템들을 관리
const MyFormItemContext = React.createContext([]);

// toArr 함수: 주어진 값이 배열이면 그대로 반환하고, 그렇지 않으면 배열로 변환
function toArr(str) {
  return Array.isArray(str) ? str : [str];
}

// MyFormItemGroup: 폼 아이템들을 그룹화하기 위한 컨텍스트 제공 컴포넌트
const MyFormItemGroup = ({ prefix, children }) => {
  // 현재 그룹의 prefix(접두어)를 React Context를 통해 관리
  const prefixPath = React.useContext(MyFormItemContext);
  const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix]);
  return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>;
};

// MyFormItem: 각 폼 항목을 렌더링하는 컴포넌트
const MyFormItem = ({ name, ...props }) => {
  // 부모에서 제공된 prefix와 현재 항목의 이름을 합쳐서 사용
  const prefixPath = React.useContext(MyFormItemContext);
  const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;
  return <Form.Item name={concatName} {...props} />; // name과 props를 Form.Item에 전달
};

// Option2Page: 서버 세팅을 위한 폼을 렌더링하는 페이지 컴포넌트
function Option2Page() {
  const [form] = Form.useForm(); // Form 인스턴스 관리

  const onFinish = (value) => {
    console.log(value); // 폼 데이터를 콘솔에 출력
  };

  const onButtonClick = () => {
    serverSettingButtonHandler(form);
  };

  return (
    <div>
      <Form name="form_item_path" layout="vertical" onFinish={onFinish} form={form}>
        <MyFormItemGroup prefix={['serverSetting']}>
          <MyFormItem name="ip" label="서버 IP">
            <Input />
          </MyFormItem>
          <MyFormItem name="port" label="서버 Port">
            <Input />
          </MyFormItem>
          <MyFormItem name="count" label="접속할 클라이언트 수">
            <Input />
          </MyFormItem>
          <Button type="primary" onClick={onButtonClick}>
            Submit
          </Button>
        </MyFormItemGroup>
      </Form>
    </div>
  );
}

export default Option2Page;
