import { ErrorMessage } from "formik";
import React from "react";
import './FieldErrorMessage.scss'

interface FieldErrorMessageInterface {
    name: string
}

const FieldErrorMessage:React.FC<FieldErrorMessageInterface> = ({ name }) => {
    return (
        <div className="custom-field-error-message">
            <ErrorMessage name={name} />
        </div>
    );
};

export default FieldErrorMessage;
