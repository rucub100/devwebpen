import LinkButton from "../components/common/LinkButton";

export default function Welcome() {
  return (
    <div className="flex flex-col @5xl:flex-row m-auto gap-8 pt-10 pb-14 px-4 max-w-[32rem] @5xl:max-w-[64rem]">
      <div className="flex-1">
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
      <div className="flex flex-col items-start flex-1">
        <h2 className="text-xl mb-2">Getting Started</h2>
        <LinkButton className="-ml-2">Start ephemeral session...</LinkButton>
        <LinkButton className="-ml-2">Create a new project...</LinkButton>
        <LinkButton className="-ml-2">Open an existing project...</LinkButton>
        <h2 className="text-xl my-2">Open Recent</h2>
      </div>
    </div>
  );
}
