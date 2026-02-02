export default function BackgroundOrnaments() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full" />
    </div>
  );
}
