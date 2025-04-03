// 외부 요청 데이터의 예시 타입 정의
export type ExternalRequestData = {
  // 실제 외부 요청 형식에 맞게 수정 필요
  id?: string;
  message?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
  // 기타 필요한 필드들
};

// Slack 메시지 포맷
export type SlackMessage = {
  text?: string;
  blocks?: SlackBlock[];
  attachments?: SlackAttachment[];
};

export type SlackBlock = {
  type: "section" | "divider" | "header" | "context";
  text?: {
    type: "plain_text" | "mrkdwn";
    text: string;
    emoji?: boolean;
  };
  fields?: {
    type: "plain_text" | "mrkdwn";
    text: string;
  }[];
  // 기타 블록 속성
};

export type SlackAttachment = {
  color?: string;
  pretext?: string;
  title?: string;
  title_link?: string;
  text?: string;
  fields?: {
    title: string;
    value: string;
    short?: boolean;
  }[];
  // 기타 어태치먼트 속성
};

// Lambda 함수 응답 타입
export type LambdaResponse = {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
};
