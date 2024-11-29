

/**
 * A general-purpose Checkbox component.
 */
const CheckBox = ({ children, name, register, errors, ...rest }) => {
    return (
        <label htmlFor={name} className="flex gap-4">
            <input
                type="checkbox"
                name={name}
                id={name}
                className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
                {...rest}
                {...register(name)}
            />
            <div>
                {children}
                {errors?.[name] && (
                    <p className="text-right text-red-600">{errors?.[name]?.message}</p>
                )}
            </div>
        </label>
    );
}

export default CheckBox;
