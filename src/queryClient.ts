// src/queryClient.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, // Количество повторных попыток при ошибке
            refetchOnWindowFocus: false, // Отключить повторный запрос при фокусе окна
        },
    },
});
