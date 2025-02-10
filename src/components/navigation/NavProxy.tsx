import { useCallback } from "react";
import { useProxy } from "../../hooks/useProxy";
import Accordion, { AccordionItem } from "../common/Accordion";
import InputNumber from "../common/InputNumber";
import Button from "../common/Button";

export default function NavProxy() {
  const { proxy, setProxyPort, startProxy, stopProxy } = useProxy({
    listenProxy: true,
  });

  const portChangeHandler = useCallback(
    (port: number) => {
      setProxyPort(port);
    },
    [setProxyPort]
  );

  const proxyActionHandler = useCallback(() => {
    if (proxy?.state != "running") {
      startProxy();
    } else {
      stopProxy();
    }
  }, [proxy, startProxy, stopProxy]);

  const listenerItem: AccordionItem = {
    key: "listener",
    title: "Listener",
    content: (
      <div className="flex flex-col p-4 gap-2 text-neutral-300">
        <p>Port:</p>
        <InputNumber
          value={proxy?.port || 9090}
          disabled={proxy?.state == "running"}
          onChange={(event) =>
            portChangeHandler(event.currentTarget.valueAsNumber)
          }
        ></InputNumber>
        <Button onClick={proxyActionHandler}>
          {proxy?.state != "running" ? "Start" : "Stop"}
        </Button>
      </div>
    ),
  };

  const items: AccordionItem[] = [listenerItem];

  return <Accordion className="p-1 min-w-[200px]" items={items} />;
}
