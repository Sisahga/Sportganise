/* eslint-disable react/prop-types */
import {
  MessageCircle,
  Calendar,
  Users,
  ClipboardList,
  MessagesSquare,
  Share2,
  ChevronsRight,
} from "lucide-react";
import log from "loglevel";
import { TrainingSessionsList } from "../ViewTrainingSessions";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { getCookies, getAccountIdCookie } from "@/services/cookiesService";
import { useState, useEffect } from "react";
import usePersonalInformation from "@/hooks/usePersonalInfromation";
import HomeContentSkeleton from "@/components/HomeContent/HomeContentSkeleton.tsx";

log.info("HomeContent component is being rendered.");

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText?: string;
  link?: string;
  delay: number;
}

export default function HomeContent() {
  const [accountType, setAccountType] = useState<string | null | undefined>();
  useEffect(() => {
    const user = getCookies();
    setAccountType(user?.type);
  }, [accountType]);

  const navigate = useNavigate();

  const [selectedMonth] = useState<Date>(new Date());
  const [firstName, setFirstName] = useState<string | null>(null);
  const cookies = getCookies();
  const accountId = cookies ? getAccountIdCookie(cookies) : null;
  const { data, loading, error } = usePersonalInformation(accountId || 0);

  useEffect(() => {
    if (data) {
      setFirstName(data.firstName);
    }
  }, [data]);

  if (loading) {
    return <HomeContentSkeleton />;
  }

  if (error) {
    return <div className="text-red">{error}</div>;
  }

  const getGreeting = (date = new Date()) => {
    const hours = date.getHours();
    if (hours < 12) {
      return "Good Morning";
    }
    if (hours < 18) {
      return "Good Afternoon";
    }
    return "Good Evening";
  };

  const FeatureCard: React.FC<FeatureCardProps> = ({
    icon,
    title,
    description,
    linkText = "",
    link = "",
    delay,
  }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: delay }}
      viewport={{ once: true }}
    >
      <div
        role="presentation"
        onClick={() => {
          navigate(link);
        }}
        className={`group p-4 lg:p-6 rounded-lg border border-navbar hover:border-secondaryColour transition-all 
                        duration-300 transform hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between 
                        active:scale-95 ${linkText !== "" ? "cursor-pointer" : ""} sm:h-32 h-36`}
      >
        <div className="flex items-center gap-4 mb-4 relative">
          <div className="relative h-full">
            <div
              className="bg-textPlaceholderColour/70 p-2 rounded-lg group-hover:bg-secondaryColour/10
                            transition-colors duration-300"
            >
              {icon}
            </div>
          </div>
          <h3 className="font-semibold text-wrap xl:text-nowrap text-sm sm:text-lg md:text-sm lg:text-base xl:text-xl">
            {title}
          </h3>
        </div>
        <p className="text-primaryColour/90">{description}</p>
        {linkText != "" && (
          <div className="flex items-end justify-between lg:items-center lg:justify-end sm:gap-2">
            <Link
              to={{ pathname: link }}
              className="flex items-center text-wrap lg:text-nowrap text-primaryColour/90
              group-hover:text-secondaryColour align-end text-xs sm:text-sm xl:text-xl w-4/5 lg:w-auto"
            >
              <p>{linkText}</p>
            </Link>
            <ChevronsRight
              strokeWidth={2}
              className="absolute right-4 lg:relative lg:right-auto w-4 h-4 sm:w-5 sm:h-5 xl:w-auto xl:h-auto
                                      group-hover:translate-x-1 transition-all ease-in-out duration-200"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
  const features = [
    {
      icon: (
        <Calendar className="w-6 h-6 text-primaryColour/90 group-hover:text-secondaryColour" />
      ),
      title: "Calendar",
      description: "",
      linkText: "View My Schedule",
      link: "/pages/CalendarPage",
    },
    {
      icon: (
        <MessagesSquare className="w-6 h-6 text-primaryColour/90 group-hover:text-secondaryColour" />
      ),
      title: "Community Forum",
      description: "",
      linkText: "View Community Feedback",
      link: "/pages/ForumPage",
    },
    {
      icon: (
        <MessageCircle className="w-6 h-6 text-primaryColour/90 group-hover:text-secondaryColour" />
      ),
      title: "Direct Messaging",
      description: "",
      linkText: "View My Messages",
      link: "/pages/DirectMessagesDashboard",
    },
    ...(accountType?.toLowerCase() === "coach" ||
    accountType?.toLowerCase() === "admin"
      ? [
          {
            icon: (
              <Share2 className="w-6 h-6 text-primaryColour/90 group-hover:text-secondaryColour" />
            ),
            title: "Create Trainings & Events",
            description: "",
            linkText: "Create a Program",
            link: "/pages/CreateTrainingSessionPage",
          },
          {
            icon: (
              <ClipboardList className="w-6 h-6 text-primaryColour/90 group-hover:text-secondaryColour" />
            ),
            title: "Training Plans",
            description: "",
            linkText: "Share Training Plans",
            link: "/pages/TrainingPlanPage",
          },
        ]
      : []),
    {
      icon: (
        <Users className="w-6 h-6 text-primaryColour/90 group-hover:text-secondaryColour" />
      ),
      title: "Alerts",
      description: "",
      linkText: "View My Notifications",
      link: "/pages/NotificationsPage",
    },
  ];

  return (
    <div className="bg-primaryColour full mt-32 z-40">
      <div
        className="flex-1 max-w-[100vw] bg-white shadow-md rounded-t-2xl pb-16 bg-gradient-to-b
                      from-secondaryColour/20 to-white to-[20%]"
      >
        <div className="min-h-screen">
          <div className="py-4 px-8 lg:px-4 flex flex-col gap-8">
            <div className="lg:mx-24 mt-6 flex flex-col gap-6 sm:gap-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl text-primaryColour text-sec font-semibold animate-flowIn sm:mt-8">
                  {getGreeting()}, {firstName}
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <FeatureCard delay={0.1 * index} key={index} {...feature} />
                ))}
              </div>
            </div>

            <div style={{ marginTop: "0 !important" }}>
              <TrainingSessionsList selectedMonth={selectedMonth} />
            </div>
            <div className="flex items-center justify-center">
              <Link
                to="/pages/CalendarPage"
                className="inline-flex items-center justify-center font-medium text-primaryColour
                hover:text-primaryColour hover:bg-textPlaceholderColour/40 text-sm px-6 py-2 border rounded-md
                h-auto mb-4 group transition-all duration-300 hover:shadow-md"
              >
                See all Programs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
