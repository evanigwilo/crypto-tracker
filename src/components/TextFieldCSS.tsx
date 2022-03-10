// import { styled, TextField } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

export default styled(TextField, {
    shouldForwardProp: (prop) => prop !== "sx"
})(({ sx }: { sx: React.CSSProperties; }) => ({
    "& .MuiInputLabel-root, .MuiInput-root, .MuiFilledInput-underline": {
        fontSize: sx?.fontSize,
    },
    // input label when focused
    "& label.Mui-focused": {
        color: sx?.color
    },
    // focused color for input with variant='filled'
    "& .MuiFilledInput-underline:after": {
        borderBottomColor: sx?.borderColor,
        borderBottom: '1px solid',
    },
    // focused color for input with variant='standard'
    "& .MuiInput-underline:after": {
        borderBottomColor: sx?.borderColor
    },
}));

