export const useTimestampConverter = (timestamp: string | undefined) => {
    if (timestamp !== undefined) {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();
        return `${day} of ${month}, ${year}`;
    }

    return null;
};
