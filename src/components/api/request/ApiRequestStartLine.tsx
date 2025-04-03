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
import { useCallback, useEffect, useState } from "react";
import Button from "../../common/Button";

interface ApiRequestStartLineProps {
  method: string;
  scheme: string;
  authority: string;
  path: string;
  onMethodChange: (method: string) => void;
  onUrlChange: (scheme: string, authority: string, path: string) => void;
  onSend: () => void;
}

export default function ApiRequestStartLine({
  method,
  scheme,
  authority,
  path,
  onMethodChange,
  onUrlChange,
  onSend,
}: ApiRequestStartLineProps) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    let url = "";

    try {
      url = decodeURIComponent(new URL(`${scheme}://${authority}${path}`).href);
    } catch (e) {
      // ignore
    }

    setUrl((prevUrl) => {
      if (prevUrl === url) {
        return prevUrl;
      }

      return url;
    });
  }, [method, scheme, authority, path]);

  const urlChangeHandler = useCallback(
    (url: string) => {
      try {
        const parsedUrl = new URL(url);

        const newScheme = parsedUrl.protocol.replace(":", "");
        const newAuthority = parsedUrl.host;
        const newPath =
          decodeURIComponent(parsedUrl.pathname) +
          decodeURIComponent(parsedUrl.search);

        if (newScheme !== "http" && newScheme !== "https") {
          return;
        }

        onUrlChange(newScheme, newAuthority, newPath);
      } catch (e) {
        // ignore
      }
    },
    [onUrlChange]
  );

  return (
    <div className="flex flex-row items-center w-full p-2">
      <select
        className="py-1 rounded-l cursor-pointer"
        value={method}
        onChange={(event) => onMethodChange(event.target.value)}
      >
        <option value="GET">GET</option>
        <option value="HEAD">HEAD</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
        <option value="CONNECT">CONNECT</option>
        <option value="OPTIONS">OPTIONS</option>
        <option value="TRACE">TRACE</option>
        <option value="PATCH">PATCH</option>
      </select>
      <input
        className="p-1 flex-grow"
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        onBlur={(event) => urlChangeHandler(event.target.value)}
        onPaste={(event) =>
          urlChangeHandler(event.clipboardData.getData("text"))
        }
        onFocus={(event) => event.target.select()}
        title={url}
        placeholder="https://example.com/api/v2/foo"
      ></input>
      <Button className="rounded-l-none" onClick={onSend}>
        Send
      </Button>
    </div>
  );
}
