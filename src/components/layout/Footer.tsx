export default function Footer() {
  return (
    <footer className="bg-transparent py-12">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-sm text-zinc-500 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-400 transition-colors">
          © {new Date().getFullYear()} Jati Notes. Build with <span className="text-red-500">❤️</span> by Wruhantojati
        </p>
      </div>
    </footer>
  );
}
