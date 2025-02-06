import { http } from "@loopme/common"

const GATEWAY_SERVICE = 'http://localhost:8000'

const getPost = async (postId: string, accessToken: string) => {
    const res = await http.get(`${GATEWAY_SERVICE}/v1/posts/${postId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    return res.data
}

export const transport = {
    getPost
}
