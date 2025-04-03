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
import { useCallback, useState } from "react";

interface ApiRequestBodyProps {
  body?: Uint8Array;
  onBodyChange: (body?: Uint8Array) => void;
}

type BodyOption = "NO_BODY" | "TEXT";

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

export default function ApiRequestBody({
  body,
  onBodyChange,
}: ApiRequestBodyProps) {
  const [bodyOption, setBodyOption] = useState<BodyOption>(
    body ? "TEXT" : "NO_BODY"
  );

  const bodyText = body ? textDecoder.decode(Uint8Array.from(body).buffer) : "";

  const bodyChangeHandler = useCallback((value: string) => {
    onBodyChange(textEncoder.encode(value));
  }, []);

  const bodyOptionChangeHandler = useCallback((value: BodyOption) => {
    switch (value) {
      case "NO_BODY":
        onBodyChange(undefined);
        break;
      case "TEXT":
        onBodyChange(new Uint8Array());
        break;
    }
    setBodyOption(value);
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <select
        className="py-1 cursor-pointer self-end mr-2 my-1"
        value={bodyOption}
        onChange={(e) => bodyOptionChangeHandler(e.target.value as BodyOption)}
      >
        <option value="NO_BODY">No Body</option>
        <option value="TEXT">Text</option>
      </select>
      <div className="h-0 w-full border-b border-neutral-800"></div>
      {bodyOption === "TEXT" && (
        <textarea
          className="w-full h-full flex-grow p-2 bg-neutral-950 text-neutral-100 resize-none outline-none"
          value={bodyText}
          onChange={(e) => bodyChangeHandler(e.target.value)}
        ></textarea>
      )}
    </div>
  );
}
