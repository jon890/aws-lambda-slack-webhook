import { SlackMessage } from "../types";

/**
 * Slack 웹훅으로 메시지를 전송하는 서비스
 */
export class SlackService {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    if (!webhookUrl) {
      throw new Error("Slack webhook URL is required");
    }
    this.webhookUrl = webhookUrl;
  }

  /**
   * Slack 웹훅으로 메시지 전송
   * @param message 전송할 슬랙 메시지
   * @returns 응답 결과
   */
  async sendMessage(message: SlackMessage): Promise<Response> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Slack webhook 호출 실패: ${response.status} ${errorText}`
        );
      }

      return response;
    } catch (error) {
      console.error("Slack 메시지 전송 실패:", error);
      throw error;
    }
  }
}
