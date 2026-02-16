import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    MagnifyingGlassIcon as SearchIcon,
    MapPinIcon,
    TrendUpIcon,
    BuildingsIcon,
    UsersIcon,
    BriefcaseIcon,
    SparkleIcon
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { ZoomIn } from '@/components/ui/ZoomIn';

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
                {/* Decorative background elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                        <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 blur-3xl"></div>
                    </div>
                </div>

                <div className="container-custom mx-auto text-center">
                    <ZoomIn>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                            <SparkleIcon size={16} weight="fill" className="text-indigo-600" />
                            AI-Powered Job Search
                        </div>
                    </ZoomIn>

                    <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                        {t('home.heroTitle')}
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                        {t('home.heroSubtitle')}
                    </p>

                    {/* Search Box */}
                    <div className="mx-auto max-w-3xl">
                        <div className="relative flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-gray-900/5 sm:flex-row sm:items-center sm:gap-0 sm:p-2">
                            <div className="relative flex-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <SearchIcon size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full rounded-xl border-0 bg-gray-50 py-3.5 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:rounded-l-xl sm:rounded-r-none sm:bg-transparent sm:text-sm sm:leading-6"
                                    placeholder={t('home.searchPlaceholder')}
                                />
                            </div>
                            <div className="hidden h-10 w-px bg-gray-200 sm:block"></div>
                            <div className="relative flex-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <MapPinIcon size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full rounded-xl border-0 bg-gray-50 py-3.5 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:bg-transparent sm:text-sm sm:leading-6"
                                    placeholder={t('home.locationPlaceholder')}
                                />
                            </div>
                            <button
                                onClick={() => navigate('/auth/signup')}
                                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-[0.98] sm:px-8"
                            >
                                {t('home.searchButton')}
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">Popular:</span>
                        {['Remote', 'React', 'Product Design', 'Backend'].map(tag => (
                            <button
                                key={tag}
                                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <div className="container-custom mx-auto">
                    <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3 lg:gap-12">
                        {[
                            { label: "Active Jobs", value: "2,500+", icon: <BriefcaseIcon size={28} weight="duotone" className="text-white" />, color: "from-blue-500 to-blue-600" },
                            { label: "Companies", value: "850+", icon: <BuildingsIcon size={28} weight="duotone" className="text-white" />, color: "from-indigo-500 to-indigo-600" },
                            { label: "Job Seekers", value: "15k+", icon: <UsersIcon size={28} weight="duotone" className="text-white" />, color: "from-purple-500 to-purple-600" },
                        ].map((stat, index) => (
                            <div key={index} className="flex flex-col items-center gap-4">
                                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                        {stat.value}
                                    </div>
                                    <div className="mt-1 text-base font-medium text-gray-600">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Jobs Section */}
            <section className="bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <div className="container-custom mx-auto">
                    <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Jobs</h2>
                            <p className="mt-2 text-base leading-7 text-gray-600 sm:text-lg">Hand-picked opportunities for you</p>
                        </div>
                        <button className="hidden items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:flex">
                            View all jobs <TrendUpIcon weight="bold" size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            { id: 1, title: 'Senior Product Designer', company: 'Google Inc.', logo: 'G', color: 'bg-red-500' },
                            { id: 2, title: 'Frontend Engineer', company: 'Facebook', logo: 'f', color: 'bg-blue-600' },
                            { id: 3, title: 'Marketing Manager', company: 'Twitter', logo: 't', color: 'bg-sky-500' }
                        ].map((job) => (
                            <div
                                key={job.id}
                                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-lg hover:ring-gray-900/10"
                            >
                                <div className="mb-5 flex items-start justify-between">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${job.color} text-lg font-bold text-white shadow-md`}>
                                        {job.logo}
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                                        Full Time
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600">
                                    <a href="#" className="focus:outline-none">
                                        <span className="absolute inset-0"></span>
                                        {job.title}
                                    </a>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {job.company} • Remote
                                </p>

                                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                                    <p className="text-sm font-semibold text-gray-900">$120k - $160k</p>
                                    <p className="text-sm text-gray-400">2d ago</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 sm:hidden">
                        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            View all jobs <TrendUpIcon weight="bold" size={16} />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
