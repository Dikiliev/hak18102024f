import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, TextField, Button, Paper, Grid } from '@mui/material';

interface Message {
    text: string;
    isUser: boolean;
}

const popularQuestions = [
    "Как долго проверяется заявление?",
    "Как подать заявление на академический отпуск?",
    "Какие документы нужны для перевода в другой университет?",
    "Как получить справку об обучении?",
    "Как восстановиться после отчисления?",
    "Как подать апелляцию по оценке экзамена?",
];

const SupportChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isFirstMessage, setIsFirstMessage] = useState(true); // Состояние для отслеживания первого сообщения

    // Загрузка сообщений из localStorage при монтировании компонента
    useEffect(() => {
        const storedMessages = localStorage.getItem('supportMessages');
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, []);

    // Сохранение сообщений в localStorage при изменении массива сообщений
    useEffect(() => {
        localStorage.setItem('supportMessages', JSON.stringify(messages));
    }, [messages]);

    // Обработка отправки сообщения
    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        const newMessage: Message = { text: inputValue, isUser: true };
        setMessages([...messages, newMessage]);
        setInputValue('');

        if (isFirstMessage) {
            // Эмуляция ответа от поддержки при первом сообщении через 1 секунду
            setTimeout(() => {
                const supportResponse: Message = {
                    text: 'Спасибо за обращение! Мы свяжемся с вами.',
                    isUser: false,
                };
                setMessages((prevMessages) => [...prevMessages, supportResponse]);
            }, 1000);
            setIsFirstMessage(false); // После первого сообщения меняем состояние
        }
    };

    return (
        <Grid container spacing={2}>
            {/* Левая панель с популярными вопросами */}
            <Grid item xs={12} md={4}>
                <Paper elevation={5} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Популярные вопросы
                    </Typography>
                    <List>
                        {popularQuestions.map((question, index) => (
                            <ListItem key={index} button>
                                <ListItemText primary={question} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>

            {/* Правая панель с чатом */}
            <Grid item xs={12} md={8}>
                <Paper elevation={5} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Чат поддержки
                    </Typography>
                    <Paper variant="outlined" sx={{ height: 'min(600px, 60vh)', overflowY: 'auto', p: 2, mb: 2 }}>
                        <List>
                            {messages.map((message, index) => (
                                <ListItem
                                    key={index}
                                    sx={{
                                        justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    <ListItemText
                                        primary={message.text}
                                        sx={{
                                            textAlign: message.isUser ? 'right' : 'left',
                                            backgroundColor: message.isUser ? '#DCF8C6' : '#F1F0F0',
                                            p: 1,
                                            borderRadius: '8px',
                                            maxWidth: '80%',
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                    <Box sx={{ display: 'flex' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Напишите сообщение..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            sx={{ mr: 1 }}
                        />
                        <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ px: 4 }}>
                            Отправить
                        </Button>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default SupportChat;
