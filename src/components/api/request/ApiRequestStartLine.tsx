import { useCallback, useEffect, useState } from "react";
import Button from "../../common/Button";

interface ApiRequestStartLineProps {
  method: string;
  scheme: string;
  authority: string;
  path: string;
  onMethodChange: (method: string) => void;
  onUrlChange: (scheme: string, authority: string, path: string) => void;
}

export default function ApiRequestStartLine({
  method,
  scheme,
  authority,
  path,
  onMethodChange,
  onUrlChange,
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
      <Button className="rounded-l-none">Send</Button>
    </div>
  );
}
