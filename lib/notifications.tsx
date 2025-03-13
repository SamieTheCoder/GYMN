import { Dumbbell } from "lucide-react";
type NotificationTexts = {
    icon: JSX.Element;
    event: string;
    description: string;
    action?: {
        true_text: string;
        false_text: string;
        true: (referral: string) => string;
        false: string;
        false_alert: {
            title: string;
            description: string;
        };
    };
};

function generateGymJoinActionLink(referral: string): string {
    return `/api/gym/join/${referral}`;
}

export const notificationsInfo: { [key: string]: NotificationTexts } = {
    gym_invite: {
        icon: <Dumbbell className='w-6 h-6 text-g_purple' />,
        event: "was invited to train at",
        description: "Accept or decline the invitation below.",
        action: {
            true_text: "Accept",
            false_text: "Decline",
            true: generateGymJoinActionLink,
            false_alert: {
                title: "Decline invitation",
                description:
                    "By declining the invitation, you won't be able to accept it until you're invited again.",
            },
            false: "",
        },
    },
};
