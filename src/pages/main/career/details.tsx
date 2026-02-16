import * as React from "react";
import {
    ChartBar,
    BriefcaseMetal,
    GraduationCap,
    Lightbulb
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

interface CareerCard {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    iconBgColor: string;
}

const careerOptions: CareerCard[] = [
    {
        id: "salary-benchmarks",
        title: "Salary Benchmarks",
        description: "Know your worth and salary growth potential",
        icon: <ChartBar size={32} weight="fill" />,
        iconBgColor: "bg-blue-50",
    },
    {
        id: "career-paths",
        title: "Career Paths",
        description: "Possible next career moves",
        icon: <BriefcaseMetal size={32} weight="fill" />,
        iconBgColor: "bg-orange-50",
    },
    {
        id: "learning-upskilling",
        title: "Learning & Upskilling",
        description: "Personal growth opportunities",
        icon: <GraduationCap size={32} weight="fill" />,
        iconBgColor: "bg-gray-100",
    },
    {
        id: "market-intelligence",
        title: "Market Intelligence",
        description: "Personalized market insights",
        icon: <Lightbulb size={32} weight="fill" />,
        iconBgColor: "bg-yellow-50",
    },
];

export function Page(): React.JSX.Element {
    const navigation = useNavigate()
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Career Progression
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Prepare the next steps of your career journey
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {careerOptions.map((option) => (
                        <button
                            key={option.id}
                             onClick={() => navigation(option?.id)}
                            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 text-left w-full border border-gray-100"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`${option.iconBgColor} rounded-xl p-3 flex items-center justify-center flex-shrink-0`}>
                                    <div className="text-gray-900">
                                        {option.icon}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {option.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {option.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
