/*
 * Copyright 2025 Ruslan Curbanov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { useEphemeralSession } from "../../hooks/useEphemeralSession";
import { useProject } from "../../hooks/useProject";
import Accordion, { AccordionItem } from "../common/Accordion";
import Button from "../common/Button";

export default function NavStart() {
  const {
    isActive: isEphemeralSessionActive,
    startEphemeralSession,
    closeEphemeralSession,
  } = useEphemeralSession({
    listenIsActive: true,
  });

  const {
    isActive: isProjectActive,
    // createProject,
    // openProject,
    closeProject,
  } = useProject({
    listenIsActive: true,
  });

  const gettingStartedItem: AccordionItem = {
    key: "start",
    title: "Getting Started",
    content: (
      <div className="flex flex-col p-4 gap-2 text-neutral-300">
        <p>You have not yet opened a project.</p>
        {/* <Button onClick={openProject}>Open Project</Button>
        <Button onClick={createProject}>New Project</Button> */}
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
        <Button onClick={closeEphemeralSession}>Close Session</Button>
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
        <Button onClick={closeProject}>Close Project</Button>
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
