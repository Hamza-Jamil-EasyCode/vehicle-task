import {
    Box,
    Chip,
    FormControl,
    FormControlLabel,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
    Typography,
    Input as MaterialInput,
    Stack,
    FormLabel,
    useTheme,
    styled,
    SxProps
} from '@mui/material';
import './Input.scss';
import PhoneInput from 'react-phone-input-2';
import FieldErrorMessage from '@components/FieldErrorMessage/FieldErrorMessage';
import 'react-phone-input-2/lib/style.css';

interface InputInterface {
    type: string;
    name: string;
    label?: string;
    required?: boolean;
    color?: 'error' | 'info' | 'success' | 'warning' | 'primary' | 'secondary';
    startIcon?: React.ReactNode;
    startIconClick?: () => void;
    endIcon?: React.ReactNode;
    endIconClick?: () => void;
    select?: boolean;
    multiSelect?: boolean;
    options?: Array<{ value: string | number; label: string | number }>;
    fullWidth?: boolean;
    error?: boolean;
    helperText?: any;
    value?: any;
    onChange?: any;
    variant?: 'filled' | 'outlined' | 'standard';
    className?: string;
    rows?: number;
    minRows?: number;
    maxRows?: number;
    multiline?: boolean;
    sx?: SxProps;
    inputRef?: any;
    inputProps?: any;
    minNumber?: number;
    maxNumber?: number;
    disabled?: boolean;
    checked?: boolean;
    placeholder?: string;
    phone?: string;
    setPhone?: any;
    separateLabel?: boolean;
}

const Input: React.FC<InputInterface> = ({
    name,
    type,
    label,
    required,
    helperText,
    variant = 'outlined',
    error,
    value,
    onChange,
    color = 'primary',
    startIcon,
    startIconClick,
    endIcon,
    endIconClick,
    select,
    multiSelect = false,
    options,
    fullWidth = false,
    className,
    rows,
    minRows,
    maxRows,
    multiline,
    sx,
    inputRef,
    inputProps,
    minNumber = 0,
    maxNumber,
    disabled,
    checked,
    placeholder,
    phone,
    setPhone,
    separateLabel = false
}) => {
    const theme = useTheme();
    if (type === 'phone') {
        return (
            <Stack
                className={`phone-input-field-wrapper ${theme.palette.mode === 'dark' ? 'theme-dark' : 'theme-light'}`}
            >
                <Typography>{separateLabel && label}</Typography>
                <PhoneInput
                    country={'us'}
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    inputStyle={{
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.mode === 'dark' ? '#fff' : '#000'
                    }}
                />
                <FieldErrorMessage name="phoneNumber" />
            </Stack>
        );
    }
    if (type === 'file') {
        return (
            <MaterialInput
                name={name}
                type="file"
                inputRef={inputRef}
                sx={sx}
                onChange={onChange}
                inputProps={{ ...inputProps }}
            />
        );
    }
    if (type === 'switch') {
        return (
            <FormControl>
                <FormControlLabel
                    name={name}
                    control={<Switch defaultChecked={value} />}
                    disabled={disabled}
                    checked={checked}
                    value={value}
                    onChange={onChange}
                    label={label}
                />
            </FormControl>
        );
    }
    if (select) {
        return (
            <Stack direction={'column'}>
                <Typography>{separateLabel && label}</Typography>
                <FormControl
                    fullWidth={fullWidth}
                    variant={variant}
                    className={`custom_select-field ${className}`}
                    error={error}
                    sx={sx}
                >
                    {!separateLabel && <InputLabel id={`${name}-label`}>{label}</InputLabel>}
                    <Select
                        labelId={`${name}-label`}
                        name={name}
                        multiple={multiSelect}
                        value={multiSelect ? [...value] : value}
                        onChange={onChange}
                        required={required}
                        color={color}
                        displayEmpty={separateLabel}
                        disabled={disabled}
                        label={!separateLabel ? label : ''}
                        startAdornment={
                            startIcon ? (
                                <InputAdornment
                                    position="start"
                                    sx={{ cursor: startIconClick ? 'pointer' : 'default' }}
                                    onClick={startIconClick}
                                >
                                    {startIcon}
                                </InputAdornment>
                            ) : undefined
                        }
                        renderValue={(selected: any) => {
                            if (selected.length === 0) {
                                return <Typography style={{ color: '#939393', opacity: 1 }}>{placeholder}</Typography>;
                            }
                            return (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 0.5,
                                        maxHeight: '70px',
                                        overflowY: 'auto'
                                    }}
                                >
                                    {/* {multiSelect
                                        ? selected?.map((value: any) => <Chip key={value} label={value} />)
                                        : value} */}
                                    {(Array.isArray(selected) ? selected : [selected]).map((val) => {
                                        const option = options?.find((opt) => opt.value === val);
                                        if(multiSelect){
                                            return <Chip key={val} label={option?.label ?? val} />;
                                        }
                                        return <Typography key={val}>{option?.label ?? val}</Typography>;
                                    })}
                                </Box>
                            );
                        }}
                    >
                        {options?.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography sx={{ color: 'error.main', fontSize: '0.8rem', mt: 0.5 }}>{helperText}</Typography>
                </FormControl>
            </Stack>
        );
    }
    return (
        <Stack direction={'column'}>
            <Typography>{separateLabel && label}</Typography>
            <TextField
                name={name}
                type={type}
                label={!separateLabel ? label : ''}
                className={`custom_text-field ${className}`}
                variant={variant}
                helperText={helperText}
                error={error}
                value={value}
                onChange={onChange}
                fullWidth={fullWidth}
                required={required}
                color={color}
                rows={rows}
                minRows={minRows}
                maxRows={maxRows}
                multiline={multiline}
                sx={sx}
                placeholder={placeholder}
                inputRef={inputRef}
                disabled={disabled}
                inputProps={{
                    ...inputProps,
                    ...(type === 'number' && { min: minNumber, max: maxNumber })
                }}
                InputProps={{
                    ...(startIcon && {
                        startAdornment: (
                            <InputAdornment
                                position="start"
                                className={endIconClick && 'clickable-icon'}
                                onClick={startIconClick}
                            >
                                {startIcon}
                            </InputAdornment>
                        )
                    }),
                    ...(endIcon && {
                        endAdornment: (
                            <InputAdornment
                                position="end"
                                className={endIconClick && 'clickable-icon'}
                                onClick={endIconClick}
                            >
                                {endIcon}
                            </InputAdornment>
                        )
                    })
                }}
            />
        </Stack>
    );
};

export default Input;
