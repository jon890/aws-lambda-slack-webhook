import type { SlackMessage } from "./slack";

/**
 * 이벤트 데이터를 Slack 메시지로 변환하는 파서 인터페이스
 */
export interface EventParser<T> {
  /**
   * 이벤트 데이터를 Slack 메시지로 변환
   * @param data 이벤트 데이터
   * @returns Slack 메시지
   */
  parse(data: T): SlackMessage;
}
