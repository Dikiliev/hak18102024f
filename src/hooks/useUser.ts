import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUserProfile, updateUserProfile } from '@api/user';
import { IUserProfile } from 'types/user';

interface IUserError {
    message: string;
    response: {
        data: {
            username: string[];
        };
    };
}

export const useUser = () => {
    const queryClient = useQueryClient();

    const {
        data: user,
        isLoading: isLoadingUser,
        error: userError,
    } = useQuery<IUserProfile>({
        queryKey: ['userProfile'],
        queryFn: fetchUserProfile,
    });

    const updateUserMutation = useMutation<IUserProfile, IUserError, FormData>({
        mutationFn: updateUserProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['userProfile'],
            });
        },
        onError: (error) => {
            console.error('Error updating user profile:', error);
        },
    });

    return {
        user,
        isLoadingUser,
        updateUser: updateUserMutation.mutate,
        error: updateUserMutation.error,
        isUpdating: updateUserMutation.isPending,
    };
};
