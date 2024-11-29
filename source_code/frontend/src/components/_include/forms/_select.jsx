import ReactSelect from "react-select";
/**
 * A general-purpose Select component powered by react-select.
 */
export const SelectField = ({
    className,
    name,
    options,
    onChange,
    label,
    defaultValue,
    isMulti,
    ...rest
}) => {
    return (
        <div className={className}>
            {label && <label className="block font-normal" htmlFor={name}>{label}</label>}
            <ReactSelect
                options={options}
                onChange={onChange}
                isMulti={isMulti}
                isSearchable={true}
                defaultValue={
                    defaultValue
                        ? Array.from(defaultValue, (value) => ({ label: name, value }))
                        : defaultValue
                }
                placeholder="Search or select..."
                {...rest}
            />
        </div>
    );
};
