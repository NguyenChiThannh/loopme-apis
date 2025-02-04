import { z } from "zod";

export const CommentReqSchema = z.object({
    content: z.string(),
});

export type CommentReq = z.infer<typeof CommentReqSchema>;