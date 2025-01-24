import WaitlistedTrainingSessionList from "./WaitlistedTrainingSessionList";

export default function WaitlistTrainingSession() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-textColour">Waitlisted Players</h1>
            <p className="text-sm text-fadedPrimaryColour">
                The training sessions below are available for waitlisted members only.
            </p>
            <WaitlistedTrainingSessionList />
        </div>
    );
}
