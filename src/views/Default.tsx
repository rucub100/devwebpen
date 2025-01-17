import { useViewState } from "../hooks/useViewState";

export default function Default() {
  const { openWelcome } = useViewState({ listen: false });
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      onDoubleClick={openWelcome}
    >
      <div className="flex flex-col m-auto w-[370px]">
        <h1 className="text-3xl mb-2 font-semibold">Welcome to devwebpen</h1>
        <p className="text-neutral-400">
          Developer's Swiss Army Knife for Web Applications
        </p>
        <p className="text-xs font-extralight text-neutral-400 mt-2">
          Devwebpen is intended for educational and research purposes. Do not
          use it to attack or penetrate systems without explicit permission.
          Unauthorized access is illegal and unethical.
        </p>
      </div>
    </div>
  );
}
