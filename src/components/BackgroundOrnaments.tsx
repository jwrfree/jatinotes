interface BackgroundOrnamentsProps {
  className?: string;
  variant?: "default" | "warm" | "subtle";
}

export default function BackgroundOrnaments({ 
  className = "",
  variant = "default" 
}: BackgroundOrnamentsProps) {
  const colors = {
    default: "bg-amber-500/15",
    warm: "bg-orange-500/10",
    subtle: "bg-amber-500/8",
  };

  const color = colors[variant];

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none opacity-60 ${className}`}>
      <div className={`absolute top-[-10%] left-1/4 w-[600px] h-[600px] ${color} blur-[120px] rounded-full`} />
      <div className={`absolute bottom-1/4 right-[-10%] w-[500px] h-[500px] ${color} blur-[100px] rounded-full`} />
      <div className={`absolute top-1/2 left-[-5%] w-[400px] h-[400px] bg-orange-400/5 blur-[100px] rounded-full`} />
    </div>
  );
}
