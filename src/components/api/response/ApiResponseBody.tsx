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
interface ApiResponseBodyProps {
  body?: Uint8Array;
}

const textDecoder = new TextDecoder();

export default function ApiResponseBody({ body }: ApiResponseBodyProps) {
  const bodyText = body ? textDecoder.decode(Uint8Array.from(body).buffer) : "";

  return (
    <textarea
      className="w-full h-full p-2 bg-neutral-950 text-neutral-100 resize-none outline-none"
      readOnly
      aria-readonly
      value={bodyText}
    ></textarea>
  );
}
