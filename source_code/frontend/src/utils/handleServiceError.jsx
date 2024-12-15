import { toast } from "react-toastify";
import ApiError from "../errors/ApiError";

export const handleServiceError = ({ error, operation }) => {
    if (error instanceof ApiError) toast.error(
        <>
            <span>{error.message}</span>
            <br />
            <span>{error.details}</span>
        </>
    )
    else toast.error(`${operation} failed. unexpected error. Please see the console for more details.`);
}