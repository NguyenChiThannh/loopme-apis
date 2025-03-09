import { http } from "@loopme/common";
import "dotenv/config";

const checkMemberGroup = async (
  groupId: string,
  userId: string,
  accessToken: string
) => {
  const res = await http.get(
    `${process.env.GATEWAY_SERVICE}/v1/groups/check-is-member-group/${groupId}/${userId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return res.data;
};

export const transport = {
  checkMemberGroup,
};
