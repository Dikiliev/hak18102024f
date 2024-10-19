import {apiInstance} from "@api/index";


interface IApplicationTypeResponse {
    id: number;
    name: string;
    description: string;
}

export const fetchApplicationTypes = async (): Promise<IApplicationTypeResponse[]> => {
    const response = await apiInstance.get('/applications/types/');
    return response.data;
};

export const fetchApplicationType = async (typeId: number | null): Promise<any> => {
    if (typeId === null) {
        // ...
    }

    const response = await apiInstance.get(`/applications/types/${typeId}/`);
    return response.data;
};

export const submitApplication = async (formData: FormData): Promise<any> => {
    const response = await apiInstance.post('/applications/list/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
