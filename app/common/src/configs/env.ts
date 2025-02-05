import 'dotenv/config'

const env = {
    JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN || '',
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS
}

export default env