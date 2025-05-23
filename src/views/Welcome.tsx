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
import LinkButton from "../components/common/LinkButton";
import Logo from "../../app-icon.svg";
import { useEphemeralSession } from "../hooks/useEphemeralSession";
import { useProject } from "../hooks/useProject";

export default function Welcome() {
  const { isActive: isEphemeralSessionActive, startEphemeralSession } =
    useEphemeralSession({
      listenIsActive: true,
    });

  const {
    isActive: isProjectActive,
    // recentProjects,
    // createProject,
    // openProject,
    // openRecentProject,
  } = useProject({
    listenIsActive: true,
    listenRecentProjects: true,
  });

  return (
    <div className="flex flex-col @5xl:flex-row m-auto gap-8 pt-10 pb-14 px-4 max-w-[32rem] @5xl:max-w-[64rem]">
      <img
        src={Logo}
        alt="Devwebpen Logo"
        className="absolute w-1/3 min-w-[350px] min-h-[350px] max-h-[90%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-color opacity-15"
      />
      <div className="flex-1 z-10">
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
      <div
        className="flex flex-col items-start flex-1 z-10"
        style={{
          display: isEphemeralSessionActive || isProjectActive ? "none" : "",
        }}
      >
        <h2 className="text-xl mb-2">Getting Started</h2>
        <LinkButton className="-ml-2" onClick={startEphemeralSession}>
          Start ephemeral session...
        </LinkButton>
        {/* <LinkButton className="-ml-2" onClick={createProject}>
          Create a new project...
        </LinkButton>
        <LinkButton className="-ml-2" onClick={openProject}>
          Open an existing project...
        </LinkButton>
        <h2 className="text-xl my-2">Open Recent</h2>
        {recentProjects?.map((project) => (
          <LinkButton
            key={project.path}
            className="-ml-2"
            onClick={() => openRecentProject(project.path)}
          >
            {project.path}
          </LinkButton>
        ))} */}
      </div>
    </div>
  );
}
