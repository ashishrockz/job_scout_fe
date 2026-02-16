import * as React from "react";
import {
    ChartLineDownIcon,
    MagnifyingGlassIcon,
    GlobeHemisphereWestIcon,
    ArchiveIcon,
    FileDashedIcon,
    UsersThreeIcon,
    WrenchIcon,
    XCircleIcon,
    CaretRightIcon,
    ChatCircleDotsIcon,
    BookOpenIcon,
    EnvelopeIcon
} from "@phosphor-icons/react";
import { useState } from "react";

interface SupportTopic {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
}

const supportTopics: SupportTopic[] = [
    {
        id: "not-enough-jobs",
        icon: <ChartLineDownIcon size={24} weight="duotone" className="text-white" />,
        title: "Not enough jobs applied",
        description: "Troubleshoot application volume issues",
        gradient: "from-amber-400 to-orange-500",
    },
    {
        id: "irrelevant-jobs",
        icon: <MagnifyingGlassIcon size={24} weight="duotone" className="text-white" />,
        title: "Irrelevant job matches",
        description: "Tune your search criteria keywords",
        gradient: "from-blue-400 to-indigo-500",
    },
    {
        id: "wrong-countries",
        icon: <GlobeHemisphereWestIcon size={24} weight="duotone" className="text-white" />,
        title: "Wrong location matches",
        description: "Fix country and remote settings",
        gradient: "from-emerald-400 to-teal-500",
    },
    {
        id: "old-closed-jobs",
        icon: <ArchiveIcon size={24} weight="duotone" className="text-white" />,
        title: "Old or closed jobs",
        description: "Avoid applying to expired listings",
        gradient: "from-gray-400 to-slate-500",
    },
    {
        id: "view-application",
        icon: <FileDashedIcon size={24} weight="duotone" className="text-white" />,
        title: "View Application Details",
        description: "See what CV was sent to companies",
        gradient: "from-violet-400 to-purple-500",
    },
    {
        id: "not-enough-interviews",
        icon: <UsersThreeIcon size={24} weight="duotone" className="text-white" />,
        title: "Low interview rate",
        description: "Tips to improve your conversion",
        gradient: "from-rose-400 to-pink-500",
    },
    {
        id: "tailored-cv",
        icon: <WrenchIcon size={24} weight="duotone" className="text-white" />,
        title: "CV Tailoring issues",
        description: "Customize how we adapt your resume",
        gradient: "from-cyan-400 to-blue-500",
    },
    {
        id: "cancel-subscription",
        icon: <XCircleIcon size={24} weight="duotone" className="text-white" />,
        title: "Cancel Subscription",
        description: "Manage your billing and plan",
        gradient: "from-red-400 to-red-600",
    },
];

// Faq Item Component
function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white hover:border-indigo-100 transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left"
            >
                <span className="font-semibold text-gray-900">{question}</span>
                <CaretRightIcon
                    size={20}
                    className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-90 text-indigo-600" : ""}`}
                />
            </button>
            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-5 px-5" : "grid-rows-[0fr] opacity-0"}`}
            >
                <div className="overflow-hidden">
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
}

export function Page(): React.JSX.Element {
    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100 pt-16 pb-20 px-4 md:px-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-[50%] -left-[10%] w-[50%] h-[100%] bg-gradient-to-br from-indigo-50/50 to-purple-50/30 rounded-full blur-3xl" />
                    <div className="absolute -bottom-[50%] -right-[10%] w-[50%] h-[100%] bg-gradient-to-tl from-blue-50/50 to-cyan-50/30 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6 border border-indigo-100">
                        <ChatCircleDotsIcon weight="fill" size={16} />
                        Support Center
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                        How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">help you?</span>
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Find answers to common questions, browse our guides, or get in touch with our team for personalized assistance.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
                {/* Search Bar Placeholder (Optional) */}
                <div className="max-w-2xl mx-auto mb-16 shadow-xl shadow-indigo-100/50 rounded-2xl bg-white p-2 flex items-center border border-gray-100">
                    <MagnifyingGlassIcon size={24} className="text-gray-400 ml-3" />
                    <input
                        type="text"
                        placeholder="Search for answers (e.g., 'billing', 'setup')"
                        className="flex-1 h-12 px-4 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-lg"
                    />
                    <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                        Search
                    </button>
                </div>

                {/* Common Topics Grid */}
                <div className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Common Topics</h2>
                        <a href="#" className="text-indigo-600 font-semibold hover:underline text-sm flex items-center gap-1">
                            View all topics <CaretRightIcon weight="bold" />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {supportTopics.map((topic) => (
                            <button
                                key={topic.id}
                                className="group bg-white rounded-2xl p-6 text-left border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.gradient} flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    {topic.icon}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {topic.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed mt-auto">
                                    {topic.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <span className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-2 block">FAQ</span>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Can't find what you're looking for? Check out our most popular questions or reach out to support.
                            </p>
                            <button className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
                                <BookOpenIcon size={20} weight="fill" />
                                Browse Knowledge Base
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <FaqItem
                            question="How does the AI copilot apply to jobs?"
                            answer="Our AI analyzes your profile and preferences to find matching jobs. It then uses your information to fill out applications automatically, tailoring responses where possible based on your history."
                        />
                        <FaqItem
                            question="Can I review applications before they are sent?"
                            answer="Yes! You can set your copilot to 'Manual Mode'. In this mode, the AI will prepare the application but wait for your approval before submitting it."
                        />
                        <FaqItem
                            question="What happens if I run out of application credits?"
                            answer="If you reach your monthly limit, your copilot will pause. You can upgrade your plan to increase your limit instantly, or wait for your credits to renew at the start of the next billing cycle."
                        />
                        <FaqItem
                            question="How do I update my CV/Resume?"
                            answer="Go to your Profile settings. You can upload a new PDF or edit your digital profile directly. The AI will immediately start using the updated information for new applications."
                        />
                        <FaqItem
                            question="Is my data safe?"
                            answer="Absolutely. We use bank-level encryption to store your data. We never share your personal information with third parties other than the specific employers you are applying to."
                        />
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
                        <p className="text-indigo-100 mb-8 text-lg">
                            Our support team is available 24/7 to assist you with any issues or questions you might have.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2">
                                <EnvelopeIcon weight="bold" size={20} />
                                Contact Support
                            </button>
                            <button className="bg-indigo-700 text-white border border-indigo-500 px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-800 transition-colors flex items-center justify-center gap-2">
                                <ChatCircleDotsIcon weight="bold" size={20} />
                                Live Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
