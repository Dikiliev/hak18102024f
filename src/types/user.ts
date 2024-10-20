export interface IUserProfileBase {
    username: string;
    role?: string;
    first_name?: string | null;
    last_name?: string | null;
    phone_number?: string | null;
    signature?: string | null;
}

export interface IUserProfileWithAvatarPath extends IUserProfileBase {
    avatar?: string | null;
}

export interface IUserProfileWithAvatarFile extends IUserProfileBase {
    avatar?: File | null;
}

export type IUserProfile = IUserProfileWithAvatarPath | IUserProfileWithAvatarFile;
