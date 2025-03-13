type TranslatedRoutesIndex = {
    [key: string]: string;
};

const translatedRoutes: TranslatedRoutesIndex = {
    dashboard: "Dashboard",
    explore: "Explore",
    inbox: "Inbox",
    profile: "Profile",
    workouts: "Workouts",
    exercises: "Exercises",
    gym: "Gym",
    notifications: "Notifications",
    new: "New",
};

export const useTranslateAppRoutes = (routename: string) => {
    return translatedRoutes[routename] || "404";
};

export const translatePathnameArray = (pathnameArray: string[]) => {
    var translated: string[] = [];
    var filteredPathnames = pathnameArray.filter((s) => s);
    for (let index = 0; index < filteredPathnames.length; index++) {
        translated.push(translatedRoutes[filteredPathnames[index]] || filteredPathnames[index]);
    }
    return translated;
};
