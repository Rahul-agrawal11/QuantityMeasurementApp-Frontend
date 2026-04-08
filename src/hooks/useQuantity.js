import { useState } from "react";
import {
    compareApi,
    convertApi,
    addApi,
    addWithTargetApi,
    subtractApi,
    subtractWithTargetApi,
    divideApi,
} from "../api/quantityApi";

export const useQuantity = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = async (apiFn, ...args) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await apiFn(...args);

            console.log("API RESPONSE 👉", data);

            const isError = data?.isError || data?.is_error; // ✅ FIX

            if (isError) {
                setError(data.errorMessage || data.error_message);
            } else {
                setResult(data);
            }

        } catch (err) {
            setError(err.response?.data?.errorMessage || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return {
        result,
        loading,
        error,
        compare: (thisQ, thatQ) => execute(compareApi, thisQ, thatQ),
        convert: (thisQ, thatQ) => execute(convertApi, thisQ, thatQ),
        add: (thisQ, thatQ) => execute(addApi, thisQ, thatQ),
        addWithTarget: (thisQ, thatQ, targetQ) => execute(addWithTargetApi, thisQ, thatQ, targetQ),
        subtract: (thisQ, thatQ) => execute(subtractApi, thisQ, thatQ),
        subtractWithTarget: (thisQ, thatQ, targetQ) => execute(subtractWithTargetApi, thisQ, thatQ, targetQ),
        divide: (thisQ, thatQ) => execute(divideApi, thisQ, thatQ),
        clearResult: () => { setResult(null); setError(null); },
    };
};