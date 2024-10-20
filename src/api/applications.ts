import { apiInstance } from "@api/index";
import axios from 'axios';
import { API_URL, BASE_URL } from '../utils/constans.ts';

// Интерфейсы для ответа API
interface IApplicationTypeResponse {
    id: number;
    name: string;
    description: string;
}

export interface IApplicationResponse {
    id: number;
    application_type: {
        id: number;
        name: string;
    };
    status: string;
    submission_date: string;
    fields_data: string;

    example_document: string | null;
    sent_document: string | null;
    ready_document: string | null;
    reviewer_comment: string | null;
}

// Получение списка типов заявлений
export const fetchApplicationTypes = async (): Promise<IApplicationTypeResponse[]> => {
    const response = await apiInstance.get('/applications/types/');
    return response.data;
};

// Получение деталей одного типа заявления
export const fetchApplicationType = async (typeId: number | null): Promise<any> => {
    if (typeId === null) {
        throw new Error("Invalid type ID");
    }

    const response = await apiInstance.get(`/applications/types/${typeId}/`);
    return response.data;
};

// Отправка нового заявления
export const submitApplication = async (formData: FormData): Promise<any> => {
    const response = await apiInstance.post('/applications/list/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',  // Убедитесь, что используется этот заголовок
        },
    });
    return response.data;
};

// Получение списка заявлений пользователя
export const fetchApplications = async (): Promise<IApplicationResponse[]> => {
    const response = await apiInstance.get('/applications/list/');
    return response.data;
};

export const fetchProrectorApplications = async (): Promise<IApplicationResponse[]> => {
    const response = await apiInstance.get('/applications/list-for-prorector/'); // Маршрут к API
    return response.data;
};

export const fetchReviewApplications = async (): Promise<IApplicationResponse[]> => {
    const response = await apiInstance.get('/applications/list-for-preview/'); // Маршрут к API
    return response.data;
};

interface ISignApplicationResponse {
    id: number;
    status: string;
    ready_document: string;
}

export const signApplication = async (applicationId: number, signatureFile: File | null): Promise<ISignApplicationResponse | null> => {
    if (signatureFile === null) {
        return null
    }

    const formData = new FormData();
    formData.append('prorector_signature', signatureFile);
    formData.append('status', 'completed'); // Изменяем статус на "готово"

    const response = await apiInstance.patch(`/applications/list/${applicationId}/sign/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

interface IRejectApplicationResponse {
    id: number;
    status: string;
}

// Отзыв заявления
export const revokeApplication = async (applicationId: number): Promise<any> => {
    const response = await apiInstance.post(`/applications/list/${applicationId}/revoke/`);
    return response.data;
};

// Скачивание готового документа
export const downloadApplication = async (documentUrl: string): Promise<void> => {
    console.log('[downloadApplication]')
    console.log(`[${BASE_URL + documentUrl}]`)
    const response = await axios.get(BASE_URL + documentUrl.replace(BASE_URL, ''), {
        responseType: 'blob', // Ожидаем файл в ответе
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'document.pdf'); // Название файла для скачивания
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Удаляем ссылку после скачивания
};



export const acceptApplication = async (applicationId: number): Promise<IApplicationResponse> => {
    const response = await apiInstance.post(`/applications/list/${applicationId}/accept/`);
    return response.data;
};

export const rejectApplication = async (applicationId: number, comment: string): Promise<IApplicationResponse> => {
    const formData = new FormData();
    formData.append('comment', comment);

    const response = await apiInstance.post(`/applications/list/${applicationId}/reject/`, formData);
    return response.data;
};

export const uploadDocument = async (applicationId: number, file: File): Promise<IApplicationResponse> => {
    const formData = new FormData();
    formData.append('sent_document', file);

    const response = await apiInstance.post(`/applications/list/${applicationId}/upload_document/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const completeApplication = async (applicationId: number, file: Blob): Promise<IApplicationResponse> => {
    const formData = new FormData();
    formData.append('ready_document', file);

    const response = await apiInstance.post(`/applications/list/${applicationId}/complete/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};