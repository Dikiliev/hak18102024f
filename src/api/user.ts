// src/api/user.ts

import { IUserProfile } from 'types/user';
import apiInstance from '@api/apiInstance';

// Функция для получения профиля пользователя
export const fetchUserProfile = async (): Promise<IUserProfile> => {
    const response = await apiInstance.get('/users/profile/');
    return response.data;
};

// Функция для обновления профиля пользователя
export const updateUserProfile = async (profileData: Partial<FormData>): Promise<IUserProfile> => {
    const response = await apiInstance.put('/users/profile/', profileData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Функция для обновления подписи пользователя
export const updateUserSignature = async (signatureData: string): Promise<IUserProfile> => {
    const formData = new FormData();
    formData.append('signature', signatureData);


    const response = await apiInstance.put('/users/profile/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};