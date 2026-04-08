import React from "react";
import { MEASUREMENT_TYPES, UNITS_BY_TYPE, TYPE_ICONS } from "../../constants/units";
import "./QuantityInput.css";

const QuantityInput = ({ label, value, onChange, hideValue = false }) => {
    const { value: qVal, unit, measurementType } = value;

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        onChange({
            value: qVal,
            measurementType: newType,
            unit: UNITS_BY_TYPE[newType][0],
        });
    };

    return (
        <div className="quantity-input">
            <label className="qi-label">{label}</label>
            <div className="qi-row">
                {/* Numeric value */}
                {!hideValue && (
                    <input
                        type="number"
                        className="qi-value"
                        value={qVal}
                        onChange={(e) => onChange({ ...value, value: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                    />
                )}

                {/* Measurement type */}
                <select
                    className="qi-select"
                    value={measurementType}
                    onChange={handleTypeChange}
                >
                    {MEASUREMENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                            {TYPE_ICONS[t]} {t.replace("Unit", "")}
                        </option>
                    ))}
                </select>

                {/* Unit */}
                <select
                    className="qi-select"
                    value={unit}
                    onChange={(e) => onChange({ ...value, unit: e.target.value })}
                >
                    {(UNITS_BY_TYPE[measurementType] || []).map((u) => (
                        <option key={u} value={u}>{u}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default QuantityInput;