import { ExternalRequestData, SlackMessage } from "../types";

/**
 * 외부 요청 데이터를 슬랙 메시지 형식으로 변환
 * @param data 외부 요청 데이터
 * @returns 슬랙 메시지 형식
 */
export function transformToSlackMessage(
  data: ExternalRequestData
): SlackMessage {
  // 여기에 실제 변환 로직 구현
  // 아래는 예시 구현입니다

  const slackMessage: SlackMessage = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `새로운 알림 ${data.id ? `#${data.id}` : ""}`,
          emoji: true,
        },
      },
      {
        type: "divider",
      },
    ],
  };

  // 메시지 내용이 있는 경우 추가
  if (data.message) {
    slackMessage.blocks?.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: data.message,
      },
    });
  }

  // 타임스탬프가 있는 경우 컨텍스트에 추가
  if (data.timestamp) {
    const date = new Date(data.timestamp);
    slackMessage.blocks?.push({
      type: "context",
      fields: [
        {
          type: "mrkdwn",
          text: `*시간:* ${date.toLocaleString("ko-KR")}`,
        },
      ],
    });
  }

  // 메타데이터가 있는 경우 필드로 추가
  if (data.metadata && Object.keys(data.metadata).length > 0) {
    const fields = Object.entries(data.metadata).map(([key, value]) => ({
      type: "mrkdwn" as const,
      text: `*${key}:* ${
        typeof value === "object" ? JSON.stringify(value) : value
      }`,
    }));

    slackMessage.blocks?.push({
      type: "section",
      fields,
    });
  }

  return slackMessage;
}
