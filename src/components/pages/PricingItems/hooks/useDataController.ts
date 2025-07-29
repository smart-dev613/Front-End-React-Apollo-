import { useEffect, useState, useCallback } from 'react';

/** Requst */
import { getAllEventContentsPricing, getAllEventContents } from '../../../../providers/events';
import { companyEmployeesAttendingEvent } from '../../../../providers/pricing';

/** Types */
import { PricingItem } from '../types';

export const useDataController = (eventId: string, companyID: string) => {
    const [data, setData] = useState<PricingItem[]>([]);
    const [contents, setContents] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);

    const fetchContentPricingData = useCallback(async () => {
        try {
            const { data: { getAllEventContentsPricing: { contents } } } = await getAllEventContentsPricing(eventId);
            setData(
                contents
                    .filter((item: any) => item.pricing && item.pricing.length > 0)
                    .reduce((acc: any, curr: any) => {
                        curr.pricing.forEach((element: any) => {
                            acc.push({
                                ...curr,
                                pricing: [element]
                            })
                        });
                        return acc;
                    }, [])
            );
        } catch (error) {
            console.log(error);
        }
    }, [eventId]);

    const fetchContentData = useCallback(async () => {
        try {
            const { data: { getAllEventContents: { contents } } } = await getAllEventContents(eventId);
            setContents(contents);
        } catch (error) {
            console.log(error);
        }
    }, [eventId]);

    const fetchEmployeeData = useCallback(async () => {
        try {
            const { data: { companyEmployeesAttendingEvent: { companyMemberships } } } = await companyEmployeesAttendingEvent({ eventId });
            setEmployees(companyMemberships);
        } catch (error) {
            console.log(error);
        }
    }, [eventId]);

    useEffect(() => {
        fetchContentPricingData();
    }, [fetchContentPricingData]);

    useEffect(() => {
        fetchContentData();
    }, [fetchContentData]);

    useEffect(() => {
        fetchEmployeeData();
    }, [fetchEmployeeData]);

    return {
        data,
        setData,
        contents,
        employees
    }
}
