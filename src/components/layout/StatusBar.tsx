import Daemon from "../status/Daemon";

export default function StatusBar() {
  return (
    <div className="flex flex-row-reverse items-center h-[24px] px-4 py-0.5 text-xs text-neutral-400 hover:text-neutral-300">
      <Daemon></Daemon>
    </div>
  );
}
