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
import { useMemo } from "react";
import { useApiClient } from "../../hooks/useApiClient";
import { useViewState } from "../../hooks/useViewState";
import Accordion, { AccordionItem } from "../common/Accordion";
import Button from "../common/Button";
import { isApiRequestTabData } from "../../types/view-state";

export default function NavApiClient() {
  const { apiClient, newApiClientRequest, openApiClientRequest } = useApiClient(
    {
      listenApiClient: true,
    }
  );

  const { tabs } = useViewState({ listenTabs: true });

  const requestId = useMemo(() => {
    const activeTab = tabs?.tabs.find((tab) => tab.id === tabs?.activeTabId);
    return isApiRequestTabData(activeTab?.data)
      ? activeTab.data.apiRequest.requestId
      : undefined;
  }, [tabs]);

  const collections: AccordionItem[] = apiClient.collections.map(
    (collection) => {
      const collectionItem: AccordionItem = {
        key: collection.name,
        title: collection.name,
        content: (
          <div className="flex flex-col p-4 gap-2 text-neutral-300 h-full overflow-auto">
            <Button onClick={() => newApiClientRequest(collection.name)}>
              Add Request
            </Button>
            <div>
              {collection.requests.map((request) => (
                <div
                  key={request.id}
                  className={`flex flex-row w-full cursor-pointer hover:bg-neutral-800 ${
                    request.id === requestId ? "bg-neutral-800" : ""
                  } p-2 rounded`}
                  onClick={() => openApiClientRequest(request.id)}
                >
                  <span className="text-xs font-thin border rounded p-1">
                    {request.method}
                  </span>
                  &ensp;
                  <span className="text-sm text-nowrap text-ellipsis">
                    New Request
                  </span>
                </div>
              ))}
            </div>
          </div>
        ),
      };

      return collectionItem;
    }
  );

  const items: AccordionItem[] = [...collections];

  return <Accordion className="p-1 min-w-[200px]" items={items} />;
}
