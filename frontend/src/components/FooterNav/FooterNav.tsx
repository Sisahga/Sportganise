import React from 'react';

const FooterNav: React.FC = () => {
  return (
    <footer className="shadow fixed bottom-0 left-0 right-0 p-2 border-t bg-white">
      <nav className="flex justify-around text-primaryColour">
        <button className="flex flex-col items-center rounded bg-secondaryColour text-primaryColour">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7.5l8.25 5.25L19.5 7.5v9l-8.25 5.25L3 16.5v-9z"
            />
          </svg>
          <span className="text-sm">Home</span>
        </button>
        <button className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4.5h18m-6 4.5h6m-6 4.5h6M3 9h6M3 13.5h6"
            />
          </svg>
          <span className="text-sm">Calendar</span>
        </button>
        <button className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7.5l6 6H6l6-6z"
            />
          </svg>
          <span className="text-sm">Alerts</span>
        </button>
        <button className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4.5h18m-6 4.5h6m-6 4.5h6M3 9h6M3 13.5h6"
            />
          </svg>
          <span className="text-sm">Inbox</span>
        </button>
        <button className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2.25c-2.213 0-4.322.778-6 2.25M18 4.5C16.322 3.028 14.213 2.25 12 2.25m0 0V7.5"
            />
          </svg>
          <span className="text-sm">Profile</span>
        </button>
      </nav>
    </footer>
  );
};

export default FooterNav;
