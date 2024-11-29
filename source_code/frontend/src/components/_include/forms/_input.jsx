import { INPUT_TYPES_TEXT_LIKE } from "../../../config";

// Styles for various input fields
const FIELD_STYLES = {
    BASE: "mt-1 w-full rounded-md py-2 px-4 border-[1px] border-gray-200 bg-white text-sm text-gray-700 shadow-sm",
    INPUT: "h-10",
    TEXTAREA: "h-40 block resize-none",
    DEFAULT: "",
};

/**
 * A general-purpose Input component.
 */
const InputField = ({
    type,
    name,
    label,
    styleKey,
    customClass,
    defaultValue,
    containerCustomClass,
    register,
    errors,
    ...rest
}) => {
    const appliedStyles = FIELD_STYLES[styleKey] || FIELD_STYLES.DEFAULT;

    if (INPUT_TYPES_TEXT_LIKE.includes(type)) {
        return (
            <div>
                {label && <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">
                    {label}
                </label>}
                <input
                    type={type}
                    name={name}
                    id={name}
                    className={`${FIELD_STYLES.BASE} ${FIELD_STYLES.INPUT} ${appliedStyles} ${customClass}`}
                    defaultValue={defaultValue}
                    {...rest}
                    {...register(name)}
                />
                {errors?.[name] && (
                    <p className="text-right text-red-600">{errors?.[name]?.message}</p>
                )}
            </div>
        );
    } else if (type === "textarea") {
        return (
            <div className={containerCustomClass}>
                {label && <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">
                    {label}
                </label>}
                <textarea
                    id={name}
                    name={name}
                    className={`${FIELD_STYLES.BASE} ${FIELD_STYLES.TEXTAREA} ${appliedStyles} ${customClass}`}
                    defaultValue={defaultValue}
                    {...rest}
                    {...register(name)}
                ></textarea>
                {errors?.[name] && (
                    <p className="text-right text-red-600">{errors?.[name]?.message}</p>
                )}
            </div>
        );
    } else {
        return <span>Unsupported input type</span>;
    }
};

export default InputField;
