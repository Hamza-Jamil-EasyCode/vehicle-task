import { Stack, Typography } from '@mui/material';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './NoDataText.scss'

const NoDataText = ({ text = 'No Data Found!' }: { text: string }) => {
    return (
        <Stack className='no-data-text-wrapper'>
            <DotLottieReact
                src="https://lottie.host/575a5f42-dc3c-4ba4-9014-15133f819c42/nUix7WztCL.lottie"
                loop
                autoplay
                className='no-data-img'
            />
            <Typography variant="h5" color={'#bcbcbc'} textAlign={'center'}>
                {text}
            </Typography>
        </Stack>
    );
};

export default NoDataText;
