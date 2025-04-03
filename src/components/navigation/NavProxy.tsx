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
import { useCallback, useMemo } from "react";
import { useProxy } from "../../hooks/useProxy";
import Accordion, { AccordionItem } from "../common/Accordion";
import InputNumber from "../common/InputNumber";
import Button from "../common/Button";
import Icon from "../common/Icon";
import LinkButton from "../common/LinkButton";
import { useViewState } from "../../hooks/useViewState";
import { isProxyTrafficTabData } from "../../types/view-state";

export default function NavProxy() {
  const {
    proxy,
    setProxyPort,
    startProxy,
    stopProxy,
    toggleDebugging,
    forwardSuspended,
    forwardAllSuspended,
    dropSuspended,
    dropAllSuspended,
  } = useProxy({
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

  const { tabs } = useViewState({ listenTabs: true });

  const suspendedId = useMemo(() => {
    const activeTab = tabs?.tabs.find((tab) => tab.id === tabs?.activeTabId);
    return isProxyTrafficTabData(activeTab?.data)
      ? activeTab.data.proxyTraffic.id
      : undefined;
  }, [tabs]);

  const anySuspended = proxy && proxy.suspendedRequests.length > 0;

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
        <Button
          disabled={!suspendedId}
          onClick={() => forwardSuspended(suspendedId!)}
        >
          Forward
        </Button>
        <Button disabled={!anySuspended} onClick={forwardAllSuspended}>
          Forward All
        </Button>
        <Button
          disabled={!suspendedId}
          onClick={() => dropSuspended(suspendedId!)}
        >
          Drop
        </Button>
        <Button disabled={!anySuspended} onClick={dropAllSuspended}>
          Drop All
        </Button>
      </div>
    ),
  };

  const items: AccordionItem[] = [listenerItem, debuggerItem];

  return <Accordion className="p-1 min-w-[200px]" items={items} />;
}
