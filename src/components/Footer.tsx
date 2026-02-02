export default function Footer() {
  return (
    <footer className="bg-transparent py-12">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          © {new Date().getFullYear()} Jati Notes. Build with <span className="text-red-500">❤️</span> by Wruhantojati
        </p>
      </div>
    </footer>
  );
}
