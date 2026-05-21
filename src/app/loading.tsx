import { Stack } from '@mui/material';
import MainLoader from '@components/MainLoader/MainLoader';

const loading = () => {
    return (
        <Stack alignItems={'center'} justifyContent={'center'} sx={{ height: '100vh' }}>
            <MainLoader />
        </Stack>
    );
};

export default loading;
