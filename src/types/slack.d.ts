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
};
