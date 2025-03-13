import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function timeSince(time: Date): string {
    const currentTime = new Date();
    const seconds = Math.floor((currentTime.getTime() - time.getTime()) / 1000);

    const intervals = {
        year: seconds / (60 * 60 * 24 * 365),
        month: seconds / (60 * 60 * 24 * 30),
        week: seconds / (60 * 60 * 24 * 7),
        day: seconds / (60 * 60 * 24),
        hour: seconds / (60 * 60),
        minute: seconds / 60,
    };

    let result: string;

    if (intervals.year > 1) {
        result = Math.floor(intervals.year) + " years ago";
    } else if (intervals.month > 1) {
        result = Math.floor(intervals.month) + " months ago";
    } else if (intervals.week > 1) {
        result = Math.floor(intervals.week) + " weeks ago";
    } else if (intervals.day > 1) {
        result = Math.floor(intervals.day) + " days ago";
    } else if (intervals.hour > 1) {
        result = Math.floor(intervals.hour) + " hours ago";
    } else if (intervals.minute > 1) {
        result = Math.floor(intervals.minute) + " minutes ago";
    } else {
        result = "Just now";
    }

    return result;
}
