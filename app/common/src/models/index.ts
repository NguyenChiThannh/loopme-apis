import { IChannel } from './channel';
import { IComment } from './comment';
import { IFriend } from './friend';
import { IGroup } from './group';
import { IMessage } from './message';
import { INotification } from './notification';
import { IOtp } from './otp';
import { IPost, PostUpdateData, filterDataPost } from './post';
import { IUser, UserUpdateData, filterDataUser } from './user';
import { IVote } from './vote';

export {
    IChannel,
    IComment,
    IFriend,
    IGroup,
    IMessage,
    INotification,
    IOtp,
    IPost, PostUpdateData, filterDataPost,
    IUser, UserUpdateData, filterDataUser,
    IVote,
}

import UserModel from './user';
import GroupModel from './group';
import ChannelModel from './channel';
import CommentModel from './comment';
import FriendModel from './friend';
import MessageModel from './message';
import NotificationModel from './notification';
import OtpModel from './otp';
import PostModel from './post';
import VoteModel from './vote';

export {
    UserModel,
    GroupModel,
    ChannelModel,
    CommentModel,
    FriendModel,
    MessageModel,
    NotificationModel,
    OtpModel,
    PostModel,
    VoteModel,
};