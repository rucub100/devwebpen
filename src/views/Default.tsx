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
import { useViewState } from "../hooks/useViewState";

import Logo from "../../app-icon.svg";

export default function Default() {
  const { openWelcome } = useViewState();

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      onDoubleClick={openWelcome}
    >
      <img
        src={Logo}
        alt="Devwebpen Logo"
        className="absolute w-1/3 min-w-[350px] min-h-[350px] max-h-[90%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-color-burn opacity-15"
      />
      <div className="flex flex-col m-auto w-[370px] z-10">
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
