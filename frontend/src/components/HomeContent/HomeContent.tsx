/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
  const navigate = useNavigate();
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
        className={`group p-6 rounded-lg border border-navbar hover:border-secondaryColour transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg active:scale-95 ${linkText !== "" ? "cursor-pointer" : ""}`}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 rounded-lg bg-textPlaceholderColour/70 group-hover:bg-secondaryColour/10 transition-colors duration-300">
            {icon}
          </div>
          <h3 className="font-semibold text-nowrap">{title}</h3>
        </div>
        <p className="text-primaryColour/90 md:min-h-[3lh] lg:min-h-[5lh] xl:min-h-[4lh]">
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
      title: "Training Sessions",
      description:
        "Efficiently manage and schedule your training sessions. Stay organized and focused on what matters most - your game.",
      linkText: "View My Schedule",
      link: "/pages/CalendarPage",
    },
    {
      icon: (
        <MessagesSquare className="w-6 h-6 text-primaryColour/90 group-hover:text-secondaryColour" />
      ),
      title: "Community Forum",
      description:
        "Share experiences, give feedback, and learn from fellow players in our vibrant community forum.",
      linkText: "View Community Feedback",
      link: "/pages/ForumPage",
    },
    {
      icon: (
        <MessageCircle className="w-6 h-6 text-primaryColour/90 group-hover:text-secondaryColour" />
      ),
      title: "Direct Messaging",
      description:
        "Connect directly with coaches and players. Build relationships and coordinate effortlessly.",
      linkText: "View My Messages",
      link: "/pages/DirectMessagesDashboard",
    },
    {
      icon: (
        <Share2 className="w-6 h-6 text-primaryColour/90 group-hover:text-secondaryColour" />
      ),
      title: "Coach Collaboration",
      description:
        "Share and access training plans with fellow coaches. Elevate coaching standards together.",
    },
    {
      icon: (
        <ClipboardList className="w-6 h-6 text-primaryColour/90 group-hover:text-secondaryColour" />
      ),
      title: "Player Insights",
      description:
        "Gain valuable insights into player development and performance trends.",
    },
    {
      icon: (
        <Users className="w-6 h-6 text-primaryColour/90 group-hover:text-secondaryColour" />
      ),
      title: "Active Community",
      description:
        "Join a thriving community of badminton enthusiasts. Learn, grow, and succeed together.",
    },
  ];

  return (
    <div className="bg-primaryColour w-screen mt-32 z-40">
      <div className="flex-1 max-w-[100vw] bg-white shadow-md bg-gradient-to-b from-secondaryColour/20 to-white to-[20%] rounded-t-2xl pb-16">
        <div className="min-h-screen">
          <div className="p-4 space-y-6">
            <Card className="border-0 lg:mx-20 rounded-md overflow-hidden mb-12 bg-transparent shadow-none">
              <div className="py-4">
                <CardHeader>
                  <CardTitle className="font-font font-bold text-3xl text-primaryColour">
                    Welcome to ONIBAD!
                  </CardTitle>
                </CardHeader>
              </div>
              <CardContent className="mb-4">
                <p className="text-primaryColour text-lg font-font leading-relaxed">
                  A non-profit badminton club for you, where passion meets play!
                </p>
              </CardContent>
            </Card>

            <div className="lg:mx-24">
              <h2 className="text-lg text-primaryColour text-sec font-semibold mb-4">
                Elevate Your Game with ONIBAD
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 min-h-[3lh]">
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
                text-sm font-font px-6 py-2 border rounded-md h-auto mb-4 group transition-all duration-300 hover:shadow-md"
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
