import { z } from "zod";

export const MessageReqSchema = z.object({
    message: z.string(),
});

export type MessageReq = z.infer<typeof MessageReqSchema>;
