import Button from "../common/Button";

export default function Start() {
  return (
    <div className="flex flex-col p-4 gap-2 text-neutral-300">
      <p>You have not yet opened a project.</p>
      <Button>Open Project</Button>
      <Button>New Project</Button>
      <Button>Ephemeral Session</Button>
    </div>
  );
}
