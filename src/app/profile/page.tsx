export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Profile</h2>
      <p>Games Played: 0</p>
      <p>Total XP: 0</p>
      <div>
        <h3 className="text-xl font-semibold">Last 10 Games</h3>
        <ul className="list-disc pl-6 text-sm">
          <li>No games played yet</li>
        </ul>
      </div>
    </div>
  );
}
