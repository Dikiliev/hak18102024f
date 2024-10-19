import {ReactNode} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button, Chip,
    Grid,
    Typography,
    useTheme
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {downloadApplication, IApplicationResponse} from "../../api/applications"; // Убедитесь, что импорт корректен
import { getAbsoluteUrl } from "../../utils/url";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {useMutation} from "@tanstack/react-query"; // Проверьте, правильно ли реализована эта функция

interface ApplicationAccordionProps {
    application: IApplicationResponse;
    expanded: number | false;
    index: number;
    handleAccordionChange:  (event: React.SyntheticEvent, expanded: boolean) => void;
    children: ReactNode;
}

const ApplicationAccordion: React.FC<ApplicationAccordionProps> = ({
                                                                       application,
                                                                       expanded,
                                                                       index,
                                                                       handleAccordionChange,
                                                                       children
                                                                   }) => {
    const theme = useTheme();

    // Функция для определения, является ли значение изображением
    const isImage = (value: string): boolean => {
        return /\.(jpg|jpeg|png|gif)$/i.test(value);
    };

    // Функция для определения, является ли значение документом
    const isDocument = (value: string): boolean => {
        return /\.(pdf|doc|docx)$/i.test(value);
    };

    const renderStatusChip = (status: string) => {
        switch (status) {
            case 'created':
                return <Chip label="Создано" color="primary" icon={<CheckCircleIcon />} />;
            case 'under_review':
                return <Chip label="Проверяется" color="warning" />;
            case 'in_progress':
                return <Chip label="В процессе" color="info" />;
            case 'completed':
                return <Chip label="Готово" color="success" icon={<CheckCircleIcon />} />;
            default:
                return <Chip label="Неизвестно" />;
        }
    };

    const downloadMutation = useMutation({
        mutationFn: (documentUrl: string) => downloadApplication(documentUrl),
    });

    const handleDownload = (documentUrl: string | null) => {
        if (!documentUrl) {
            return;
        }
        downloadMutation.mutate(documentUrl);
    };

    return (
        <Accordion
            key={application.id}
            expanded={expanded === index}
            onChange={handleAccordionChange}
            sx={{ borderRadius: 1, mb: 2, backgroundColor: theme.palette.background.paper, overflow: 'hidden' }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {application.application_type.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        {renderStatusChip(application.status)}
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="body2" color="textSecondary">
                            {new Date(application.submission_date).toLocaleDateString()}
                        </Typography>
                    </Grid>
                </Grid>
            </AccordionSummary>

            <AccordionDetails>
                <Box mb={2}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Детали заявления:</Typography>
                    {Object.entries(application.fields_data).map(([field, value], idx) => (
                        <Box key={idx} mb={2}>
                            <Typography>{field}:</Typography>
                            {typeof value === 'string' && isImage(value) ? (
                                <Box
                                    component="img"
                                    src={getAbsoluteUrl(value)}
                                    alt={field}
                                    sx={{
                                        width: 'auto',
                                        height: 200,
                                        objectFit: 'contain',
                                        borderRadius: 1,
                                        boxShadow: 1,
                                    }}
                                />
                            ) : isDocument(value) ? (
                                <Button variant="contained" onClick={() => handleDownload(value)}>
                                    Скачать документ
                                </Button>
                            ) : (
                                <Typography>{value}</Typography>
                            )}
                        </Box>
                    ))}
                </Box>

                {children}
            </AccordionDetails>
        </Accordion>
    );
};

export default ApplicationAccordion;
