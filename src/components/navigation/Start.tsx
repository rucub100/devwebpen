import { useEphemeralSession } from "../../hooks/useEphemeralSession";
import { useProject } from "../../hooks/useProject";
import Accordion, { AccordionItem } from "../common/Accordion";
import Button from "../common/Button";

export default function Start() {
  const { isActive: isEphemeralSessionActive, startEphemeralSession } =
    useEphemeralSession({
      listenIsActive: true,
    });

  const {
    isActive: isProjectActive,
    createProject,
    openProject,
  } = useProject({
    listenIsActive: true,
  });

  const gettingStartedItem: AccordionItem = {
    key: "start",
    title: "Getting Started",
    content: (
      <div className="flex flex-col p-4 gap-2 text-neutral-300">
        <p>You have not yet opened a project.</p>
        <Button onClick={openProject}>Open Project</Button>
        <Button onClick={createProject}>New Project</Button>
        <Button onClick={startEphemeralSession}>Ephemeral Session</Button>
      </div>
    ),
  };

  const ephemeralSessionItem: AccordionItem = {
    key: "ephemeral-session",
    title: "Ephemeral Session",
    content: (
      <div className="flex flex-col p-4 gap-2 text-neutral-300">
        <p>
          An ephemeral session is a temporary session that is not saved or
          persisted.
        </p>
        <p>
          It is useful for quick experiments, testing, or when you don't want to
          save your work.
        </p>
        <p>An ephemeral session will be lost when you close the application.</p>
      </div>
    ),
  };

  const projectItem: AccordionItem = {
    key: "project",
    title: "Project",
    content: (
      <div className="flex flex-col p-4 gap-2 text-neutral-300">
        <p>
          Projects are useful for organizing your work and saving your progress.
        </p>
      </div>
    ),
  };

  const items: AccordionItem[] = [
    ...(isEphemeralSessionActive || isProjectActive
      ? []
      : [gettingStartedItem]),
    ...(isEphemeralSessionActive ? [ephemeralSessionItem] : []),
    ...(isProjectActive ? [projectItem] : []),
  ];

  return <Accordion className="p-1 min-w-[200px]" items={items} />;
}
