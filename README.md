# AWS Lambda Slack Webhook

AWS Lambda를 사용하여 외부 요청을 받아 Slack 웹훅으로 전송하는 TypeScript 프로젝트입니다.

## 기능

- 외부 요청 데이터를 받아서 Slack 메시지 형식으로 변환
- Slack 웹훅을 통해 메시지 전송
- AWS Lambda와 API Gateway 통합을 위한 핸들러 제공

## 환경 설정

### 필수 요구사항

- Node.js v18 이상
- pnpm
- AWS 계정 (Lambda 배포용)
- Slack Webhook URL

### 설치

```bash
# 의존성 설치
pnpm install
```

### 환경 변수

AWS Lambda 콘솔에서 다음 환경 변수를 설정하세요:

- `SLACK_WEBHOOK_URL`: 실제 Slack 웹훅 URL
- `NODE_ENV`: production

## 개발

```bash
# TypeScript 컴파일 (개발 모드)
pnpm dev

# 빌드
pnpm build
```

## 배포

```bash
# Lambda 배포 패키지 생성
pnpm zip
```

이후 생성된 `function.zip` 파일을 AWS Lambda 콘솔에 업로드하여 배포할 수 있습니다.

### Lambda 설정

1. AWS Lambda 함수 생성
2. 런타임: Node.js 18.x 이상
3. 핸들러: `index.handler`
4. 환경 변수 설정:
   - `SLACK_WEBHOOK_URL`: 실제 Slack 웹훅 URL
   - `NODE_ENV`: production

### API Gateway 연동 (선택사항)

1. API Gateway에서 REST API 생성
2. Lambda 함수와 통합
3. POST 메서드 생성 및 Lambda 함수 연결

## 사용 예시

API Gateway를 통해 다음과 같은 형식의 JSON을 POST로 전송:

```json
{
  "id": "123",
  "message": "중요 알림: 서버 재시작이 필요합니다.",
  "timestamp": "2023-11-01T14:30:00Z",
  "metadata": {
    "서버": "prod-api-1",
    "상태": "경고",
    "CPU": "95%"
  }
}
```

또는 주문 이벤트를 보내려면 다음과 같은 형식을 사용할 수 있습니다:

```json
{
  "eventType": "CREATE_ORDER",
  "order": {
    "orderNo": "20250403-75404A758",
    "memberYn": "N",
    "ordererName": "김서우",
    "platformType": "MOBILE_WEB",
    "lastPayAmt": 242000,
    "orderProducts": [
      {
        "productName": "[봄맞이할인] 딥 극락 번들",
        "orderProductOptions": [
          {
            "orderCnt": 1
          }
        ]
      }
    ]
  },
  "pay": {
    "payType": "CREDIT_CARD",
    "payInfo": {}
  }
}
```

## 프로젝트 구조

```
aws-lambda-slack-webhook/
├── dist/                 # 컴파일된 JavaScript 파일
├── src/
│   ├── index.ts          # Lambda 핸들러
│   ├── types/            # 타입 정의
│   ├── services/         # 서비스 클래스
│   └── utils/            # 유틸리티 함수
├── package.json
├── tsconfig.json
└── README.md
```
