import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { StudentLayout } from "../../components/layout/StudentLayout";
import { Icon } from "../../components/common/Icon";
import { Badge } from "../../components/ui/Badge";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

export const Route = createFileRoute("/dashboard/leaderboard")({
  component: LeaderboardPage,
});

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  points: number;
  streak: number;
}

function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/analytics/leaderboard").then((res) => {
      if (res.success) {
        setLeaderboard(res.leaderboard || []);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <StudentLayout activeItem="/dashboard/leaderboard">
        <div className="flex items-center justify-center py-24">
          <Icon name="hourglass_top" className="text-4xl text-primary animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  // Find podium spots
  const rank1 = leaderboard.find((e) => e.rank === 1);
  const rank2 = leaderboard.find((e) => e.rank === 2);
  const rank3 = leaderboard.find((e) => e.rank === 3);
  
  // Rest of the ranks
  const runnerUps = leaderboard.filter((e) => e.rank > 3);

  // User stats
  const userRank = leaderboard.find((e) => e.id === user?.id);

  return (
    <StudentLayout activeItem="/dashboard/leaderboard">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Global Leaderboard</h1>
        <p className="text-on-surface-variant text-sm font-medium">Rankings updated daily based on question accuracy and streaks</p>
      </div>

      {/* User Status Bar */}
      <div className="mb-10 p-5 rounded-2xl bg-primary text-on-primary border border-primary-container shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface/15 text-accent border border-surface/20">
            <Icon name="emoji_events" className="text-[26px]" />
          </div>
          <div>
            <div className="font-bold text-sm">Your Leaderboard Standing</div>
            <div className="text-xs text-on-primary/75 font-semibold mt-0.5">
              {userRank 
                ? `You are ranked #${userRank.rank} globally with ${userRank.points} points!`
                : `Complete practice sessions to enter the leaderboard list.`}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6 shrink-0 font-mono">
          <div className="text-center">
            <span className="text-[10px] text-on-primary/70 uppercase font-bold block">Your Score</span>
            <span className="text-lg font-extrabold text-accent">{user?.leaderboardPoints || 0} pts</span>
          </div>
          <div className="h-8 w-[1px] bg-on-primary/20" />
          <div className="text-center">
            <span className="text-[10px] text-on-primary/70 uppercase font-bold block">Daily Streak</span>
            <span className="text-lg font-extrabold text-accent flex items-center gap-1">
              <Icon name="local_fire_department" className="text-[20px] text-accent animate-pulse" />
              {user?.streakCount || 0} days
            </span>
          </div>
        </div>
      </div>

      {/* Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-10 select-none">
        
        {/* Rank 2 (Left) */}
        <div className="order-2 md:order-1 flex flex-col items-center">
          {rank2 ? (
            <div className="w-full max-w-[240px] bg-surface rounded-2xl p-6 border border-outline-variant/40 shark-shadow text-center flex flex-col items-center gap-4 transition-all hover:scale-[1.02]">
              <div className="relative">
                <span className="absolute -top-3.5 -right-3.5 h-7 w-7 rounded-full bg-slate-300 text-slate-800 text-xs font-mono font-bold flex items-center justify-center border border-white shadow-sm">2</span>
                <div className="h-16 w-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-display text-xl font-bold border-2 border-slate-300">
                  {rank2.name.charAt(0)}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-on-surface line-clamp-1">{rank2.name}</h4>
                <span className="text-xs font-mono font-bold text-slate-500">{rank2.points} pts</span>
              </div>
              <Badge variant="default" className="text-[10px] flex items-center gap-0.5">
                <Icon name="local_fire_department" className="text-xs text-error animate-pulse" />
                {rank2.streak} day streak
              </Badge>
            </div>
          ) : (
            <div className="w-full max-w-[240px] bg-surface-container-low rounded-2xl p-8 border border-dashed border-outline-variant text-center text-xs text-on-surface-variant">Spot vacant</div>
          )}
          <div className="hidden md:block w-full max-w-[240px] h-10 bg-slate-200/50 rounded-b-2xl border-t border-slate-300/40" />
        </div>

        {/* Rank 1 (Center) */}
        <div className="order-1 md:order-2 flex flex-col items-center">
          {rank1 ? (
            <div className="w-full max-w-[260px] bg-surface rounded-2xl p-8 border-2 border-accent shark-shadow text-center flex flex-col items-center gap-5 relative overflow-visible transition-all hover:scale-[1.03]">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-accent bg-[#0B1929] px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1 shadow-md border border-accent/30 animate-bounce">
                <Icon name="workspace_premium" className="text-xs" /> Leader
              </div>
              <div className="relative mt-2">
                <span className="absolute -top-3.5 -right-3.5 h-8 w-8 rounded-full bg-accent text-primary text-sm font-mono font-bold flex items-center justify-center border-2 border-white shadow-sm">1</span>
                <div className="h-20 w-20 bg-accent/10 text-[#B07A15] rounded-full flex items-center justify-center font-display text-2xl font-bold border-2 border-accent">
                  {rank1.name.charAt(0)}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-base text-on-surface line-clamp-1">{rank1.name}</h4>
                <span className="text-sm font-mono font-extrabold text-accent">{rank1.points} pts</span>
              </div>
              <Badge variant="accent" className="text-[10px] flex items-center gap-0.5">
                <Icon name="local_fire_department" className="text-xs fill-primary text-primary animate-pulse" />
                {rank1.streak} day streak
              </Badge>
            </div>
          ) : (
            <div className="w-full max-w-[260px] bg-surface-container-low rounded-2xl p-8 border border-dashed border-outline-variant text-center text-xs text-on-surface-variant">Spot vacant</div>
          )}
          <div className="hidden md:block w-full max-w-[260px] h-16 bg-accent/20 rounded-b-2xl border-t border-accent/30" />
        </div>

        {/* Rank 3 (Right) */}
        <div className="order-3 flex flex-col items-center">
          {rank3 ? (
            <div className="w-full max-w-[240px] bg-surface rounded-2xl p-6 border border-outline-variant/40 shark-shadow text-center flex flex-col items-center gap-4 transition-all hover:scale-[1.02]">
              <div className="relative">
                <span className="absolute -top-3.5 -right-3.5 h-7 w-7 rounded-full bg-amber-600 text-white text-xs font-mono font-bold flex items-center justify-center border border-white shadow-sm">3</span>
                <div className="h-16 w-16 bg-amber-50 text-amber-800 rounded-full flex items-center justify-center font-display text-xl font-bold border-2 border-amber-600">
                  {rank3.name.charAt(0)}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-on-surface line-clamp-1">{rank3.name}</h4>
                <span className="text-xs font-mono font-bold text-amber-700">{rank3.points} pts</span>
              </div>
              <Badge variant="default" className="text-[10px] flex items-center gap-0.5">
                <Icon name="local_fire_department" className="text-xs text-error animate-pulse" />
                {rank3.streak} day streak
              </Badge>
            </div>
          ) : (
            <div className="w-full max-w-[240px] bg-surface-container-low rounded-2xl p-8 border border-dashed border-outline-variant text-center text-xs text-on-surface-variant">Spot vacant</div>
          )}
          <div className="hidden md:block w-full max-w-[240px] h-6 bg-amber-600/10 rounded-b-2xl border-t border-amber-600/20" />
        </div>

      </div>

      {/* Runner-ups Table */}
      <div className="rounded-2xl bg-surface p-8 border border-outline-variant/40 shark-shadow">
        <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider mb-6">Runner Ups (Rank 4 & 5)</h3>
        {runnerUps.length > 0 ? (
          <div className="space-y-3">
            {runnerUps.map((entry) => {
              const isCurrentUser = entry.id === user?.id;
              return (
                <div 
                  key={entry.id} 
                  className={`p-4 rounded-xl border flex justify-between items-center transition-colors ${
                    isCurrentUser 
                      ? "border-accent bg-accent/5 shadow-xs" 
                      : "border-outline-variant/30 bg-surface-container-lowest"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-bold text-on-surface-variant w-6 text-center">#{entry.rank}</span>
                    <div className="h-10 w-10 bg-surface-container-high text-primary rounded-full flex items-center justify-center font-bold text-sm">
                      {entry.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-on-surface leading-snug">{entry.name} {isCurrentUser && "(You)"}</h4>
                      <span className="text-[10px] font-mono text-on-surface-variant block uppercase tracking-wider">Ranked Runner Up</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 font-mono">
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-primary">{entry.points} pts</span>
                    </div>
                    <div className="text-right hidden xs:block">
                      <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                        <Icon name="local_fire_department" className="text-sm text-error animate-pulse" />
                        {entry.streak} days
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant text-center py-6">Positions empty.</p>
        )}
      </div>
    </StudentLayout>
  );
}
