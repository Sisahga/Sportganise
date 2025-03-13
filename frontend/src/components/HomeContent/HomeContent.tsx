/* eslint-disable react/prop-types */
import {
  MessageCircle,
  Calendar,
  Users,
  ClipboardList,
  MessagesSquare,
  Share2,
  ChevronRight,
} from "lucide-react";
import log from "loglevel";
import { TrainingSessionsList } from "../ViewTrainingSessions";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { getCookies,getAccountIdCookie } from "@/services/cookiesService";
import { useState, useEffect } from "react";
import usePersonalInformation from "@/hooks/usePersonalInfromation";

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red">{error}</div>;
  }


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
        className={`group p-6 rounded-lg border border-navbar hover:border-secondaryColour transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg active:scale-95 ${linkText !== "" ? "cursor-pointer" : ""} h-32`}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 rounded-lg bg-textPlaceholderColour/70 group-hover:bg-secondaryColour/10 transition-colors duration-300">
            {icon}
          </div>
          <h3 className="font-semibold text-nowrap xl:text-xl md:text-xl lg:text-sm sm:text-lg text-md">{title}</h3>
        </div>
        <p className="text-primaryColour/90">
          {description}
        </p>
        {linkText != "" && (
          <Link
            to={{ pathname: link }}
            className="flex mt-3 text-sm items-center xl:text-lg text-nowrap place-content-end text-primaryColour/90 group-hover:text-secondaryColour align-end"
          >
            {linkText}
            <ChevronRight className="group-hover:translate-x-1 transition-all ease-in-out duration-200" />
          </Link>
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
    <div className="bg-primaryColour w-screen mt-32 z-40">
      <div className="flex-1 max-w-[100vw] bg-white shadow-md rounded-t-2xl pb-16 bg-gradient-to-b from-secondaryColour/20 to-white to-[20%]">
        <div className="min-h-screen">
          <div className="p-4 space-y-6">

            <div className="lg:mx-24 mb-20 mt-6">
              <h2 className="text-2xl text-primaryColour text-sec font-semibold mb-4">
                Hello {firstName}!
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {features.map((feature, index) => (
                  <FeatureCard delay={0.1 * index} key={index} {...feature} />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <TrainingSessionsList />
            </div>
            <div className="flex items-center justify-center">
              <Link
                to="/pages/CalendarPage"
                className="inline-flex items-center justify-center font-medium text-primaryColour hover:text-primaryColour hover:bg-textPlaceholderColour/40
                text-sm px-6 py-2 border rounded-md h-auto mb-4 group transition-all duration-300 hover:shadow-md"
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
