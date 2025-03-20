import { useCallback } from "react";
import { useProxy } from "../../hooks/useProxy";
import Accordion, { AccordionItem } from "../common/Accordion";
import InputNumber from "../common/InputNumber";
import Button from "../common/Button";
import Icon from "../common/Icon";
import LinkButton from "../common/LinkButton";

export default function NavProxy() {
  const { proxy, setProxyPort, startProxy, stopProxy, toggleDebugging } =
    useProxy({
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
  }, [proxy?.state, startProxy, stopProxy]);

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

  const debuggerItem: AccordionItem = {
    key: "debugger",
    title: "Debugger",
    content: (
      <div className="flex flex-col p-4 gap-2 text-neutral-300">
        <LinkButton
          className="max-w-max"
          onClick={toggleDebugging}
          disabled={proxy?.state !== "running"}
        >
          <Icon icon={proxy?.debug ? "toggle_on" : "toggle_off"}></Icon>
          <span className="ml-2">Debugging {proxy?.debug ? "on" : "off"}</span>
        </LinkButton>
        <Button>Forward</Button>
        <Button>Forward All</Button>
        <Button>Drop</Button>
        <Button>Drop All</Button>
      </div>
    ),
  };

  const items: AccordionItem[] = [listenerItem, debuggerItem];

  return <Accordion className="p-1 min-w-[200px]" items={items} />;
}
