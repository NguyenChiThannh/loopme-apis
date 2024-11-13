import { z } from "zod";

export const ChannelReqSchema = z.object({
    friendId: z.string(),
});

export type ChannelReq = z.infer<typeof ChannelReqSchema>;