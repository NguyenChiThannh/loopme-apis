import { http } from "@loopme/common";

const getPost = async (postId: string, accessToken: string) => {
  const res = await http.get(
    `${process.env.GATEWAY_SERVICE}/v1/posts/${postId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return res.data;
};

export const transport = {
  getPost,
};
