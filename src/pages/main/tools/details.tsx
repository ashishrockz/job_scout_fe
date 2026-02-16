import * as React from "react";
import {
    FilePdf,
    Article,
    UsersThree,
    BriefcaseMetal,
    ChartLineUp,
    GoogleChromeLogo
} from "@phosphor-icons/react";

interface ToolCard {
    id: string;
    title: string;
    icon: React.ReactNode;
    iconBgColor: string;
}

const tools: ToolCard[] = [
    {
        id: "cv-builder",
        title: "CV Builder",
        icon: <FilePdf size={24} weight="fill" />,
        iconBgColor: "bg-purple-100",
    },
    {
        id: "cover-letter",
        title: "Cover Letter Builder",
        icon: <Article size={24} weight="fill" />,
        iconBgColor: "bg-purple-100",
    },
    {
        id: "interview-roleplay",
        title: "Job Interview Roleplay",
        icon: <UsersThree size={24} weight="fill" />,
        iconBgColor: "bg-purple-100",
    },
    {
        id: "offer-negotiation",
        title: "Offer Negotiation Advisor",
        icon: <BriefcaseMetal size={24} weight="fill" />,
        iconBgColor: "bg-purple-100",
    },
    {
        id: "career-advisors",
        title: "Career Advisors",
        icon: <ChartLineUp size={24} weight="fill" />,
        iconBgColor: "bg-purple-100",
    },
    {
        id: "chrome-extension",
        title: "Chrome Extension",
        icon: <GoogleChromeLogo size={24} weight="fill" />,
        iconBgColor: "bg-purple-100",
    },
];

export function Page(): React.JSX.Element {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
                    AI Tools
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tools.map((tool) => (
                        <button
                            key={tool.id}
                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4 text-left w-full border border-gray-100"
                        >
                            <div className={`${tool.iconBgColor} rounded-2xl p-3 flex items-center justify-center text-purple-600`}>
                                {tool.icon}
                            </div>
                            <span className="text-lg font-semibold text-gray-900">
                                {tool.title}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
