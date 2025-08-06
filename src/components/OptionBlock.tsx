import { Option } from "../types";

interface Props {
    option: Option;
    disabled: boolean;
    availableOptions: { id: string; name: string }[];
    onUpdate: (o: Option) => void;
    onDelete: () => void;
}

const OptionBlock = ({ option, disabled, availableOptions, onUpdate, onDelete }: Props) => {
    const handleChange = (field: keyof Option, value: string) => {
        const updatedOption = {
            ...option,
            [field]: field === "name" ? value : parseFloat(value) || 0,
        };
        onUpdate(updatedOption);
    };

    return (
        <div className="option-block">
            <select
                value={option.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={disabled}
            >
                {availableOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                        {opt.name}
                    </option>
                ))}
            </select>

            <input
                type="number"
                placeholder="Strike"
                value={option.strike}
                disabled={disabled}
                onChange={(e) => handleChange("strike", e.target.value)}
            />
            <input
                type="number"
                placeholder="Coupon"
                value={option.coupon}
                disabled={disabled}
                onChange={(e) => handleChange("coupon", e.target.value)}
            />
            <input
                type="number"
                placeholder="Knock-In"
                value={option.knockIn}
                disabled={disabled}
                onChange={(e) => handleChange("knockIn", e.target.value)}
            />
            <input
                type="number"
                placeholder="Knock-Out"
                value={option.knockOut}
                disabled={disabled}
                onChange={(e) => handleChange("knockOut", e.target.value)}
            />
            <input
                type="number"
                placeholder="C"
                value={option.c}
                disabled={disabled}
                onChange={(e) => handleChange("c", e.target.value)}
            />
            <input
                type="number"
                placeholder="P"
                value={option.p}
                disabled={disabled}
                onChange={(e) => handleChange("p", e.target.value)}
            />

            {!disabled && (
                <button className="delete-btn" onClick={onDelete}>
                    Delete
                </button>
            )}
        </div>
    );
};

export default OptionBlock;
