import "dotenv/config";

const processEnv = {
  DATABASE_NAME: "mxh",

  JWT_ACCESS_TOKEN: "access",
  JWT_REFRESH_TOKEN: "refresh",

  AMQP_PORT: "amqp://rabbitmq:5672",

  EXCHANGENAME_REALTIME_SERVICE: "REALTIME",
  EXCHANGENAME_NOTIFICATION_SERVICE: "NOTIFICATION",

  SMTP_USER: "thanh.161003@gmail.com",
  SMTP_PASS: "vibi yivt nohj voej",
};

export const ENV_Common = {
  JWT_ACCESS_TOKEN: processEnv.JWT_ACCESS_TOKEN,
  JWT_REFRESH_TOKEN: processEnv.JWT_REFRESH_TOKEN,

  AMQP_PORT: processEnv.AMQP_PORT,

  SMTP_USER: processEnv.SMTP_USER,
  SMTP_PASS: processEnv.SMTP_PASS,

  EXCHANGENAME_REALTIME_SERVICE: processEnv.EXCHANGENAME_REALTIME_SERVICE,
  EXCHANGENAME_NOTIFICATION_SERVICE:
    processEnv.EXCHANGENAME_NOTIFICATION_SERVICE,
};
