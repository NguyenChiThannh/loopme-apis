import { http } from "@loopme/common"

const GATEWAY_SERVICE = 'http://localhost:8000'

const checkMemberGroup = async (groupId: string, userId: string, accessToken: string) => {
    const res = await http.get(`${GATEWAY_SERVICE}/v1/groups/check-is-member-group/${groupId}/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    return res.data
}


export const transport = {
    checkMemberGroup
}
