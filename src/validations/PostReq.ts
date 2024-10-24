import { z } from "zod";

export const PostReqSchema = z.object({
    groupId: z.string().optional(),
    privacy: z.enum(['public', 'private', 'friends'], {
        errorMap: () => ({ message: "Chế độ bài viết không hợp lệ." }),
    }).default('public'),
})

export type PostReq = z.infer<typeof PostReqSchema>;
