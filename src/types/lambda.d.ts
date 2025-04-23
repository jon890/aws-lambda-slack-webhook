// Lambda 함수 응답 타입
export type LambdaResponse = {
  statusCode: number;
  body: any;
  headers?: Record<string, string>;
};
