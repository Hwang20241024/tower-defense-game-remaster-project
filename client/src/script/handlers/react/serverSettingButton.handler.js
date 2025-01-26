import { message } from 'antd'; // 메시지 알림을 띄우기 위해 antd에서 제공하는 message 임포트

export const serverSettingButtonHandler = (form) => {
  // form이 제대로 전달되었는지 체크하고, 그 후에 로직을 처리
  if (!form) {
    console.error('form이 정의되지 않았습니다.');
    return;
  }



  form
    .validateFields()
    .then((values) => {
      // 유효성 검사 통과 시 처리할 로직
      const currentIp = form.getFieldValue(['serverSetting', 'ip']);
      const currentPort = form.getFieldValue(['serverSetting', 'port']);
      const currentCount = form.getFieldValue(['serverSetting', 'count']);

      let valid = true;

      // IP 검증 (간단히 '127.0.0.1' 형식으로 검증)
      if (
        !/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
          currentIp,
        )
      ) {
        message.error('유효하지 않은 IP 주소입니다.');
        form.setFieldsValue({
          serverSetting: {
            ip: '', // 서버 IP
          },
        });
        valid = false;
      }

      // 포트 검증 (1~65535 범위)
      if (
        !/^\d+$/.test(currentPort) ||
        parseInt(currentPort) < 1 ||
        parseInt(currentPort) > 65535
      ) {
        message.error('유효하지 않은 포트 번호입니다.');
        form.setFieldsValue({
          serverSetting: {
            port: '', // 서버 Port
          },
        });
        valid = false;
      }

      // 클라이언트 수 검증 (100 이상)
      if (!/^\d+$/.test(currentCount) || parseInt(currentCount) < 100) {
        message.error('접속할 클라이언트 수는 100 이상이어야 합니다.');
        form.setFieldsValue({
          serverSetting: {
            count: '', // 접속할 클라이언트 수
          },
        });
        valid = false;
      }

      if (valid) {
        //시작 로직
        message.success('서버 설정이 성공적으로 적용되었습니다.');

        

        // 유효성 검사 통과 후 폼 제출
        form.submit(); // 여기서 폼 제출을 트리거할 수 있습니다.
      }
    })
    .catch((errorInfo) => {
      // 실패시
      console.error('폼 유효성 검사 오류:', errorInfo);
    });
};
